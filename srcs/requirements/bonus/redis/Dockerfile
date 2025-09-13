FROM alpine:3.21

# Install Redis
RUN apk update && apk upgrade && \
    apk add --no-cache \
        redis \
        sudo \
        su-exec


# Create redis user with UID 1000 if it doesn't exist
RUN addgroup -g 1000 redis 2>/dev/null || true && \
    adduser -D -s /bin/sh -u 1000 -G redis redis 2>/dev/null || true

# Create necessary directories
RUN mkdir -p /var/lib/redis /var/log/redis /etc/redis /var/run

# Copy Redis configuration
COPY conf/redis.conf /etc/redis/redis.conf
RUN	chown 1000:1000 /etc/redis/redis.conf
# Set proper ownership for ALL redis directories and files
RUN chown -R 1000:1000 /var/lib/redis /var/log/redis /etc/redis /var/run

RUN touch /var/log/redis/redis.log
RUN chown 1000:1000 /var/log/redis/redis.log

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose Redis port
EXPOSE 6379

# Set working directory
WORKDIR /var/lib/redis

# Start Redis
ENTRYPOINT ["docker-entrypoint.sh"]
