#!/bin/bash

export REDIS_PASS="insert password here" 

echo "=== WordPress Redis Cache Integration Test ==="
echo

# Check if WordPress can connect to Redis
echo "1. Testing WordPress-Redis connection..."

# Test from WordPress container
docker exec wordpress sh -c '
if command -v redis-cli >/dev/null 2>&1; then
    echo "Redis CLI available in WordPress container"
    redis-cli -h redis -p 6379 -a '$REDIS_PASS' ping
else
    echo "Installing Redis CLI..."
    apk add --no-cache redis
    redis-cli -h redis -p 6379 -a '$REDIS_PASS' ping
fi
'
echo

# Check if WordPress is using Redis for object caching
echo "2. Checking WordPress object cache..."

# Look for WordPress cache keys in Redis
echo "Looking for WordPress cache keys in Redis:"
docker exec wordpress redis-cli -h redis -p 6379 -a $REDIS_PASS keys "*wordpress*" | head -10
docker exec wordpress redis-cli -h redis -p 6379 -a $REDIS_PASS keys "*wp*" | head -10

echo

# Test WordPress transients (if using Redis for transients)
echo "3. Testing WordPress transients caching:"
docker exec wordpress redis-cli -h redis -p 6379 -a $REDIS_PASS keys "*transient*" | head -5

echo

# Simulate WordPress object caching
echo "4. Simulating WordPress object cache operations:"

# WordPress typically uses keys like: wp:posts:1, wp:options:all_options, etc.
WP_POST_KEY="wp:posts:test_post_123"
WP_OPTIONS_KEY="wp:options:active_plugins"

echo "Setting WordPress post cache..."
docker exec wordpress redis-cli -h redis -p 6379 -a $REDIS_PASS setex "$WP_POST_KEY" 3600 "{\"ID\":123,\"post_title\":\"Test Post\",\"post_content\":\"Test content\"}"

echo "Setting WordPress options cache..."
docker exec wordpress redis-cli -h redis -p 6379 -a $REDIS_PASS setex "$WP_OPTIONS_KEY" 3600 "[\"plugin1/plugin1.php\",\"plugin2/plugin2.php\"]"

echo "Retrieving cached WordPress data:"
echo "Post cache:"
docker exec wordpress redis-cli -h redis -p 6379 -a $REDIS_PASS get "$WP_POST_KEY"
echo "Options cache:"
docker exec wordpress redis-cli -h redis -p 6379 -a $REDIS_PASS get "$WP_OPTIONS_KEY"

echo

# Check Redis database usage
echo "5. Redis database information:"
docker exec wordpress redis-cli -h redis -p 6379 -a $REDIS_PASS info keyspace

echo

# Performance test with WordPress-like operations
echo "6. WordPress-like cache performance test:"
echo "Testing typical WordPress cache operations..."

start_time=$(date +%s.%N)
for i in {1..100}; do
    # Simulate post caching
    docker exec wordpress redis-cli -h redis -p 6379 -a $REDIS_PASS setex "wp:posts:$i" 3600 "{\"ID\":$i,\"title\":\"Post $i\"}" > /dev/null
    # Simulate user caching  
    docker exec wordpress redis-cli -h redis -p 6379 -a $REDIS_PASS setex "wp:users:$i" 1800 "{\"ID\":$i,\"login\":\"user$i\"}" > /dev/null
    # Simulate options caching
    docker exec wordpress redis-cli -h redis -p 6379 -a $REDIS_PASS setex "wp:options:option_$i" 7200 "value_$i" > /dev/null
done
end_time=$(date +%s.%N)

duration=$(echo "$end_time - $start_time" | bc -l)
echo "300 WordPress-like cache operations took: ${duration} seconds"

echo

# Clean up test data
echo "7. Cleaning up test data..."
docker exec wordpress redis-cli -h redis -p 6379 -a $REDIS_PASS del "$WP_POST_KEY" "$WP_OPTIONS_KEY" > /dev/null
docker exec wordpress redis-cli -h redis -p 6379 -a $REDIS_PASS eval "
for i=1,100 do 
    redis.call('del', 'wp:posts:'..i)
    redis.call('del', 'wp:users:'..i) 
    redis.call('del', 'wp:options:option_'..i)
end" 0 > /dev/null

echo "✅ WordPress Redis cache integration test completed!"
