FROM alpine:3.21

# Install Redis
RUN apk update && apk upgrade && \
    apk add --no-cache \
        redis \
        sudo \
		su-exec

# Create redis user and group if they don't exist
RUN addgroup -g 1000 redis 2>/dev/null || true && \
    adduser -D -s /bin/sh -u 1000 -G redis redis 2>/dev/null || true

# Create necessary directories
RUN mkdir -p 				/var/lib/redis /var/log/redis /etc/redis /var/run
RUN chown -R redis:redis	/var/lib/redis /var/log/redis /etc/redis /var/run
# Copy Redis configuration
COPY conf/redis.conf /etc/redis/redis.conf
RUN chown redis:redis /etc/redis/redis.conf

RUN touch /var/log/redis/redis.log
RUN chown redis:redis /var/log/redis/redis.log

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Switch to redis user
#USER redis

# Expose Redis port
EXPOSE 6379

# Set working directory
WORKDIR /var/lib/redis

# Health check
#HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#    CMD redis-cli ping || exit 1

# Start Redis
ENTRYPOINT ["docker-entrypoint.sh"]
#CMD ["redis-server", "/etc/redis/redis.conf"]
