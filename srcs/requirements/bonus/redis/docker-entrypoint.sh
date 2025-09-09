#!/bin/sh
set -e

# Function to handle shutdown gracefully
shutdown() {
    echo "Shutting down Redis..."
    if [ -f /var/run/redis.pid ]; then
        kill -TERM $(cat /var/run/redis.pid)
        wait $(cat /var/run/redis.pid)
    fi
    exit 0
}

# Trap SIGTERM and SIGINT
trap shutdown TERM INT

# Ensure proper permissions
if [ "$(id -u)" = '0' ]; then
    #chown -R redis:redis /var/lib/redis /var/log/redis
    exec su-exec redis "$0" "$@"
fi

# Create log file if it doesn't exist
touch /var/log/redis/redis.log
# Configure Redis security
if [ -n "$REDIS_PASSWORD" ]; then
    echo "Setting up Redis with password authentication..."
    echo "" >> /etc/redis/redis.conf
    echo "# Security configuration" >> /etc/redis/redis.conf
    echo "protected-mode yes" >> /etc/redis/redis.conf
    echo "requirepass $REDIS_PASSWORD" >> /etc/redis/redis.conf
else
    echo "Setting up Redis without password (protected mode disabled)..."
    echo "" >> /etc/redis/redis.conf
    echo "# Security configuration" >> /etc/redis/redis.conf
    echo "protected-mode no" >> /etc/redis/redis.conf
fi

# test on wordpress container : apk add redis && redis-cli -h redis -p 6379 -a $REDIS_PASSWORD ping
#chown redis:redis /etc/redis/redis.conf

# If the first argument is redis-server
if [ "$1" = 'redis-server' ]; then
    # Check if config file exists
    if [ ! -f "$2" ]; then
        echo "Redis configuration file not found: $2"
        exit 1
    fi
    echo "Starting Redis server..."
    exec "$@"
fi

# Execute the command
exec "$@"
