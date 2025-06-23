#!/bin/sh

mkdir -p /var/www/adminer
cp /tmp/index.php /var/www/adminer/index.php 
cp /tmp/www.conf /etc/php82/php-fpm.d/www.conf
exec /usr/sbin/php-fpm82 -F;
