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

echo "Start"
echo "Running as user: $(id -u):$(id -g)"

# Trap SIGTERM and SIGINT
trap shutdown TERM INT

# Check if config file exists and is readable
if [ ! -f /etc/redis/redis.conf ]; then
    echo "ERROR: Config file /etc/redis/redis.conf does not exist!"
    exit 1
fi

echo "Config file permissions: $(ls -la /etc/redis/redis.conf)"

# Show current config content before modification
echo "=== Current config content (last 10 lines) ==="
tail -10 /etc/redis/redis.conf
echo "=== End of current config ==="

# Configure Redis security
if [ -n "$REDIS_PASSWORD" ]; then
    echo "Setting up Redis with password authentication..."
    {
        echo ""
        echo "# Security configuration added by entrypoint"
        echo "protected-mode yes"
        echo "requirepass $REDIS_PASSWORD"
    } >> /etc/redis/redis.conf
else
    echo "Setting up Redis without password (protected mode disabled)..."
    {
        echo ""
        echo "# Security configuration added by entrypoint"
        echo "protected-mode no"
    } >> /etc/redis/redis.conf
fi

echo "After security configuration"

# Show final config content
echo "=== Final config content (last 15 lines) ==="
tail -15 /etc/redis/redis.conf
echo "=== End of final config ==="

# Check directory permissions
echo "Data directory permissions: $(ls -ld /var/lib/redis)"

echo "Starting Redis server..."
# Start Redis without any additional flags to avoid confusion
exec redis-server /etc/redis/redis.conf
