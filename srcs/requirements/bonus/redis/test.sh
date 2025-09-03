#!/bin/bash

# Load environment variables from .env file
if [ -f "$(dirname "$0")/../../../.env" ]; then
    export $(grep -v '^#' "$(dirname "$0")/../../../.env" | xargs)
fi

# Fallback if REDIS_PASSWORD is not set
if [ -z "$REDIS_PASSWORD" ]; then
    export REDIS_PASSWORD=_PASShibou99
fi

echo "=== WordPress Redis Cache Integration Test ==="
echo "Using Redis password: ${REDIS_PASSWORD}"
echo

# Check if WordPress can connect to Redis
echo "1. Testing WordPress-Redis connection..."

# Test from WordPress container - FIXED: Pass environment variable properly
docker exec wordpress sh -c "
if command -v redis-cli >/dev/null 2>&1; then
    echo 'Redis CLI available in WordPress container'
    redis-cli -h redis -p 6379 -a '$REDIS_PASSWORD' ping
else
    echo 'Installing Redis CLI...'
    apk add --no-cache redis
    redis-cli -h redis -p 6379 -a '$REDIS_PASSWORD' ping
fi
"
echo

# Check if WordPress is using Redis for object caching
echo "2. Checking WordPress object cache..."

# Look for WordPress cache keys in Redis - FIXED: Use redis container directly for reliability
echo "Looking for WordPress cache keys in Redis:"
docker exec redis redis-cli -a "$REDIS_PASSWORD" keys "*wordpress*" 2>/dev/null | head -10
docker exec redis redis-cli -a "$REDIS_PASSWORD" keys "*wp*" 2>/dev/null | head -10

echo

# Test WordPress transients (if using Redis for transients)
echo "3. Testing WordPress transients caching:"
docker exec redis redis-cli -a "$REDIS_PASSWORD" keys "*transient*" 2>/dev/null | head -5

echo

# Simulate WordPress object caching
echo "4. Simulating WordPress object cache operations:"

# WordPress typically uses keys like: wp:posts:1, wp:options:all_options, etc.
WP_POST_KEY="wp:posts:test_post_123"
WP_OPTIONS_KEY="wp:options:active_plugins"

echo "Setting WordPress post cache..."
docker exec redis redis-cli -a "$REDIS_PASSWORD" setex "$WP_POST_KEY" 3600 "{\"ID\":123,\"post_title\":\"Test Post\",\"post_content\":\"Test content\"}" 2>/dev/null

echo "Setting WordPress options cache..."
docker exec redis redis-cli -a "$REDIS_PASSWORD" setex "$WP_OPTIONS_KEY" 3600 "[\"plugin1/plugin1.php\",\"plugin2/plugin2.php\"]" 2>/dev/null

echo "Retrieving cached WordPress data:"
echo "Post cache:"
docker exec redis redis-cli -a "$REDIS_PASSWORD" get "$WP_POST_KEY" 2>/dev/null
echo "Options cache:"
docker exec redis redis-cli -a "$REDIS_PASSWORD" get "$WP_OPTIONS_KEY" 2>/dev/null

echo

# Check Redis database usage
echo "5. Redis database information:"
docker exec redis redis-cli -a "$REDIS_PASSWORD" info keyspace 2>/dev/null

echo

# Performance test with WordPress-like operations
echo "6. WordPress-like cache performance test:"
echo "Testing typical WordPress cache operations..."

start_time=$(date +%s.%N)
for i in {1..100}; do
    # Simulate post caching - FIXED: Use redis container directly
    docker exec redis redis-cli -a "$REDIS_PASSWORD" setex "wp:posts:$i" 3600 "{\"ID\":$i,\"title\":\"Post $i\"}" > /dev/null 2>&1
    # Simulate user caching  
    docker exec redis redis-cli -a "$REDIS_PASSWORD" setex "wp:users:$i" 1800 "{\"ID\":$i,\"login\":\"user$i\"}" > /dev/null 2>&1
    # Simulate options caching
    docker exec redis redis-cli -a "$REDIS_PASSWORD" setex "wp:options:option_$i" 7200 "value_$i" > /dev/null 2>&1
done
end_time=$(date +%s.%N)

# FIXED: Use awk instead of bc for better compatibility
duration=$(awk "BEGIN {printf \"%.3f\", $end_time - $start_time}")
echo "300 WordPress-like cache operations took: ${duration} seconds"

echo

# Clean up test data
echo "7. Cleaning up test data..."
docker exec redis redis-cli -a "$REDIS_PASSWORD" del "$WP_POST_KEY" "$WP_OPTIONS_KEY" > /dev/null 2>&1

# FIXED: Simplified cleanup using individual del commands instead of complex Lua script
echo "Cleaning up performance test data..."
for i in {1..100}; do
    docker exec redis redis-cli -a "$REDIS_PASSWORD" del "wp:posts:$i" "wp:users:$i" "wp:options:option_$i" > /dev/null 2>&1
done

echo "✅ WordPress Redis cache integration test completed!"

# Additional diagnostics
echo
echo "8. Final Redis statistics:"
echo "Total keys in Redis:"
docker exec redis redis-cli -a "$REDIS_PASSWORD" dbsize 2>/dev/null
echo "Memory usage:"
docker exec redis redis-cli -a "$REDIS_PASSWORD" info memory 2>/dev/null | grep used_memory_human
