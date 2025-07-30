#!/bin/bash

export REDIS_PASS="Insert Redis password here"

echo "=== Redis Cache Monitoring ==="
echo "Press Ctrl+C to stop monitoring"
echo

while true; do
    clear
    echo "=== Redis Cache Status - $(date) ==="
    echo
    
    # Basic info
    echo "1. Connection Status:"
    if docker exec wordpress redis-cli -h redis -p 6379 -a $REDIS_PASS ping >/dev/null 2>&1; then
        echo "✅ Redis is responding"
    else
        echo "❌ Redis is not responding"
    fi
    echo
    
    # Memory usage
    echo "2. Memory Usage:"
    docker exec redis redis-cli -a $REDIS_PASS info memory | grep -E "(used_memory_human|used_memory_peak_human|maxmemory_human)"
    echo
    
    # Key statistics
    echo "3. Key Statistics:"
    docker exec redis redis-cli -a $REDIS_PASS info keyspace
    echo
    
    # Recent operations
    echo "4. Recent Activity:"
    docker exec redis redis-cli  -a $REDIS_PASS info stats | grep -E "(total_commands_processed|instantaneous_ops_per_sec|keyspace_hits|keyspace_misses)"
    echo
    
    # Cache hit ratio
    HITS=$(docker exec redis redis-cli  -a $REDIS_PASS info stats | grep "keyspace_hits" | cut -d: -f2 | tr -d '\r')
    MISSES=$(docker exec redis redis-cli  -a $REDIS_PASS info stats | grep "keyspace_misses" | cut -d: -f2 | tr -d '\r')
    
    if [ -n "$HITS" ] && [ -n "$MISSES" ] && [ "$HITS" -gt 0 ] || [ "$MISSES" -gt 0 ]; then
        TOTAL=$((HITS + MISSES))
        if [ "$TOTAL" -gt 0 ]; then
            HIT_RATIO=$(echo "scale=2; $HITS * 100 / $TOTAL" | bc -l)
            echo "5. Cache Hit Ratio: ${HIT_RATIO}% (${HITS} hits, ${MISSES} misses)"
        else
            echo "5. Cache Hit Ratio: No data yet"
        fi
    else
        echo "5. Cache Hit Ratio: No data available"
    fi
    echo
    
    # Connected clients
    echo "6. Connected Clients:"
    docker exec redis redis-cli info clients | grep "connected_clients"
    echo
    
    sleep 5
done
