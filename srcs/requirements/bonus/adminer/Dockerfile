FROM alpine:3.21

# Install PHP and necessary extensions
RUN apk update && apk upgrade
RUN apk add --no-cache php82 php82-fpm php82-mysqli php82-session curl netcat-openbsd

# Create user and group for adminer (1000:1000)
RUN addgroup -g 1000 -S adminer && \
    adduser -D -s /bin/sh -u 1000 -G adminer adminer

# Create necessary directories and set permissions
RUN mkdir -p /var/www/adminer \
    && mkdir -p /var/log/php82 \
    && mkdir -p /run/php-fpm82 \
    && chown -R adminer:adminer /var/www/adminer \
    && chown -R adminer:adminer /var/log/php82 \
    && chown -R adminer:adminer /run/php-fpm82

# Download Adminer and set it up
RUN curl -fSL -o /var/www/adminer/index.php https://github.com/vrana/adminer/releases/download/v5.3.0/adminer-5.3.0.php \
    && chmod 644 /var/www/adminer/index.php \
    && chown adminer:adminer /var/www/adminer/index.php

# Copy PHP-FPM configuration
COPY conf/www.conf /etc/php82/php-fpm.d/www.conf
RUN chmod 644 /etc/php82/php-fpm.d/www.conf

# Copy and set up init script
COPY adminer_init.sh /usr/local/bin/adminer_init.sh
RUN chmod 755 /usr/local/bin/adminer_init.sh

# Switch to non-root user
USER adminer

ENTRYPOINT ["/usr/local/bin/adminer_init.sh"]
