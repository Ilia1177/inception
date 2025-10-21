#!/bin/sh

# Ensure directories exist (they should already from Dockerfile)
#mkdir -p /var/www/adminer
#mkdir -p /var/log/php82
#mkdir -p /run/php-fpm82

# Start PHP-FPM
exec /usr/sbin/php-fpm82 -F
