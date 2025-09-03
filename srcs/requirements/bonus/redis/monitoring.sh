#!/bin/bash

# Load environment variables from .env file
if [ -f "$(dirname "$0")/../../../.env" ]; then
    export $(grep -v '^#' "$(dirname "$0")/../../../.env" | xargs)
fi

# Fallback if REDIS_PASSWORD is not set
if [ -z "$REDIS_PASSWORD" ]; then
    export REDIS_PASSWORD="Put the password here"
fi

echo "=== Redis Cache Monitoring ==="
echo "Press Ctrl+C to stop monitoring"
echo

while true; do
    clear
    echo "=== Redis Cache Status - $(date) ==="
    echo
    
    # Basic info - Fixed: Connect directly to redis container instead of through wordpress
    echo "1. Connection Status:"
    if docker exec redis redis-cli -a $REDIS_PASSWORD ping >/dev/null 2>&1; then
        echo "✅ Redis is responding"
    else
        echo "❌ Redis is not responding"
    fi
    echo
    
    # Memory usage
    echo "2. Memory Usage:"
    docker exec redis redis-cli -a $REDIS_PASSWORD info memory 2>/dev/null | grep -E "(used_memory_human|used_memory_peak_human|maxmemory_human)"
    echo
    
    # Key statistics
    echo "3. Key Statistics:"
    KEYSPACE_INFO=$(docker exec redis redis-cli -a $REDIS_PASSWORD info keyspace 2>/dev/null)
    if [ -n "$KEYSPACE_INFO" ] && [ "$KEYSPACE_INFO" != "# Keyspace" ]; then
        echo "$KEYSPACE_INFO"
    else
        echo "No keys stored yet"
    fi
    echo
    
    # Recent operations
    echo "4. Recent Activity:"
    docker exec redis redis-cli -a $REDIS_PASSWORD info stats 2>/dev/null | grep -E "(total_commands_processed|instantaneous_ops_per_sec|keyspace_hits|keyspace_misses)"
    echo
    
    # Cache hit ratio - Fixed: Better error handling
    echo "5. Cache Hit Ratio:"
    HITS=$(docker exec redis redis-cli -a $REDIS_PASSWORD info stats 2>/dev/null | grep "keyspace_hits" | cut -d: -f2 | tr -d '\r')
    MISSES=$(docker exec redis redis-cli -a $REDIS_PASSWORD info stats 2>/dev/null | grep "keyspace_misses" | cut -d: -f2 | tr -d '\r')
    
    if [ -n "$HITS" ] && [ -n "$MISSES" ]; then
        TOTAL=$((HITS + MISSES))
        if [ "$TOTAL" -gt 0 ]; then
            # Use awk instead of bc for better compatibility
            HIT_RATIO=$(awk "BEGIN {printf \"%.2f\", $HITS * 100 / $TOTAL}")
            echo "${HIT_RATIO}% (${HITS} hits, ${MISSES} misses)"
        else
            echo "No operations yet"
        fi
    else
        echo "No data available"
    fi
    echo
    
    # Connected clients
    echo "6. Connected Clients:"
    docker exec redis redis-cli -a $REDIS_PASSWORD info clients 2>/dev/null | grep "connected_clients"
    echo
    
    # Server info
    echo "7. Server Info:"
    docker exec redis redis-cli -a $REDIS_PASSWORD info server 2>/dev/null | grep -E "(redis_version|uptime_in_seconds|tcp_port)"
    echo
    
    echo "Refreshing in 5 seconds... (Press Ctrl+C to stop)"
    sleep 5
done
