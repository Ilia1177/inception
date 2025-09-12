#!/bin/sh

# Validate environment variables first
if [ -z "$WP_PATH" ]; then
    echo "[ERROR] WP_PATH environment variable is not set!"
    exit 1
fi

echo "[INFO] Starting WordPress container setup..."
echo "[INFO] Running as: $(whoami)"
echo "[INFO] WP_PATH: $WP_PATH"

# Create shared group and WordPress user
RUN groupadd -g 1000 www-data && \
    useradd -r -u 1000 -g www-data www-data

# Create WordPress directory first
mkdir -p "$WP_PATH"

# Move configuration files as root (with error handling)
if [ -f "/tmp/www.conf" ]; then
    mv /tmp/www.conf /etc/php82/php-fpm.d/www.conf
else
    echo "[WARN] /tmp/www.conf not found, using default configuration"
fi

#if [ -d "/tmp/html" ]; then
 #   mv /tmp/html /var/www/html
#else
#    echo "[WARN] /tmp/html not found, creating directory"
#    mkdir -p /var/www/html
#fi

# Create and set permissions for PHP log directory
mkdir -p /var/log/php82
chown -R 1000:1000 /var/log/php82
chmod -R 775 /var/log/php82

# Set PHP memory limit
echo "memory_limit = 256M" >> /etc/php82/php.ini

# Wait for MariaDB
echo "[INFO] Waiting for MariaDB connection..."
while ! mariadb -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1" 2>/dev/null; do
  echo "Waiting for MariaDB..."
  sleep 2
done
echo "[INFO] MariaDB connection successful"

# Install WP-CLI as root
echo "[INFO] Installing WP-CLI..."
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
mv wp-cli.phar /usr/local/bin/wp

# Create WordPress directory structure as root
mkdir -p "$WP_PATH/wp-content/themes"
mkdir -p "$WP_PATH/wp-content/plugins"
mkdir -p "$WP_PATH/wp-content/uploads"

# CRITICAL: Set ownership of WP directory BEFORE any WordPress operations
chown -R 1000:1000 "$WP_PATH"
chmod -R 775 "$WP_PATH"

# Move theme as root (with error handling)
if [ -d "/tmp/breevia" ]; then
    mv /tmp/breevia "$WP_PATH/wp-content/themes/breevia"
    chown -R 1000:1000 "$WP_PATH/wp-content/themes/breevia"
    echo "[INFO] Breevia theme installed"
else
    echo "[WARN] Breevia theme not found at /tmp/breevia"
fi

echo "[INFO] Switching to www-data and running WordPress installation..."
# Pass environment variables explicitly to wp-install script
# Using su without - to preserve environment, then explicitly set HOME
exec su www-data -c "
    export HOME=/home/www-data
    export WP_PATH='$WP_PATH'
    export DB_NAME='$DB_NAME'
    export DB_USER='$DB_USER'
    export DB_PASSWORD='$DB_PASSWORD'
    export DB_HOST='$DB_HOST'
    export SITE_TITLE='$SITE_TITLE'
    export WP_ADMIN_NAME='$WP_ADMIN_NAME'
    export WP_ADMIN_PASS='$WP_ADMIN_PASS'
    export WP_ADMIN_MAIL='$WP_ADMIN_MAIL'
    export WP_EDITOR_NAME='$WP_EDITOR_NAME'
    export WP_EDITOR_PASS='$WP_EDITOR_PASS'
    export WP_EDITOR_MAIL='$WP_EDITOR_MAIL'
    cd '$WP_PATH'
    /usr/local/bin/wp-install.sh
"

## Double-check ownership before any operations
#chown -R www-data:incept $WP_PATH 2>/dev/null || true
#chmod -R 775 $WP_PATH 2>/dev/null || true
#
## Download WordPress if not present
#if [ ! -f \"$WP_PATH/wp-load.php\" ]; then
#    echo \"[INFO] Downloading WordPress core...\"
#    wp core download --path=$WP_PATH
#else
#    echo \"[INFO] WordPress already downloaded at $WP_PATH\"
#fi
#
## Create wp-config if not exists
#if [ ! -f \"$WP_PATH/wp-config.php\" ]; then
#    echo \"[INFO] Create wp-config.php\"
#    wp config create \
#        --dbname=\"$DB_NAME\" \
#        --dbuser=\"$DB_USER\" \
#        --dbpass=\"$DB_PASSWORD\" \
#        --dbhost=\"$DB_HOST\" \
#        --path=$WP_PATH
#else
#    echo \"[INFO] wp-config.php already exists\"
#fi
#
## Install WordPress if not installed
#if ! wp core is-installed --path=$WP_PATH 2>/dev/null; then
#    echo \"[INFO] Installing WordPress core...\"
#    wp core install \
#        --url=\"https://npolack.42.fr\" \
#        --title=\"$SITE_TITLE\" \
#        --admin_user=\"$WP_ADMIN_NAME\" \
#        --admin_password=\"$WP_ADMIN_PASS\" \
#        --admin_email=$WP_ADMIN_MAIL \
#        --path=$WP_PATH
#else
#    echo \"[INFO] WordPress is already installed\"
#fi
#
## Create editor user if not exists
#if ! wp user get \"$WP_EDITOR_NAME\" --path=$WP_PATH 2>/dev/null; then
#    echo \"[INFO] Creating editor user...\"
#    wp user create \"$WP_EDITOR_NAME\" \"$WP_EDITOR_MAIL\" \
#        --role=editor \
#        --user_pass=\"$WP_EDITOR_PASS\" \
#        --display_name=\"$WP_EDITOR_NAME\" \
#        --path=$WP_PATH
#else
#    echo \"[INFO] Editor user already exists\"
#fi
#
## Customize WordPress
#echo \"[INFO] Customize Wordpress with theme & plugin\"
#wp theme activate breevia --path=$WP_PATH
#wp plugin install jetpack --activate --path=$WP_PATH
#wp plugin install classic-editor --activate --path=$WP_PATH
#wp plugin install redis-cache --activate --path=$WP_PATH
#
#echo \"[INFO] Running as user: \$(whoami)\"
#echo \"[INFO] Running as group: \$(id -gn)\"
#echo \"[INFO] File ownership in $WP_PATH:\"
#ls -la \"$WP_PATH\"
#
## Start PHP-FPM as www-data
#echo \"[INFO] Starting php-fpm82 as www-data\"
#exec /usr/sbin/php-fpm82 -F
#"
