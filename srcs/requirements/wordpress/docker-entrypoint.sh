#!/bin/sh

# Validate environment variables first
if [ -z "$WP_PATH" ]; then
    echo "[ERROR] WP_PATH environment variable is not set!"
    exit 1
fi

echo "[INFO] Starting WordPress container setup..."
echo "[INFO] Running as: $(whoami)"
echo "[INFO] WP_PATH: $WP_PATH"

# Create shared group and WordPress user (FIX: Remove RUN, use shell commands)
if ! getent group www-data > /dev/null 2>&1; then
    addgroup -g 1000 www-data
    echo "[INFO] Created www-data group"
else
    echo "[INFO] www-data group already exists"
fi

if ! getent passwd www-data > /dev/null 2>&1; then
    adduser -D -u 1000 -G www-data www-data
    echo "[INFO] Created www-data user"
else
    echo "[INFO] www-data user already exists"
fi

# Create home directory for www-data
mkdir -p /home/www-data
chown www-data:www-data /home/www-data

# Create WordPress directory first
mkdir -p "$WP_PATH"

# Move configuration files as root (with error handling)
if [ -f "/tmp/www.conf" ]; then
    mv /tmp/www.conf /etc/php82/php-fpm.d/www.conf
    echo "[INFO] Moved www.conf"
else
    echo "[WARN] /tmp/www.conf not found, using default configuration"
fi

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
