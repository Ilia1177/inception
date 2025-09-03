#!/bin/sh

# Run initial setup as root
mkdir -p $WP_PATH
echo "I am : $(whoami)" 
id $(whoami)

# Create shared group and WordPress user
addgroup incept 2>/dev/null || true
adduser -D -G incept wpuser 2>/dev/null || true

# Move configuration files as root
mv /tmp/www.conf /etc/php82/php-fpm.d/www.conf
mv /tmp/html /var/www/html

# Create and set permissions for PHP log directory
mkdir -p /var/log/php82
chown -R wpuser:incept /var/log/php82
chmod -R 775 /var/log/php82

# CRITICAL: Set ownership of WP directory BEFORE any WordPress operations
chown -R wpuser:incept $WP_PATH
chmod -R 775 $WP_PATH

# Set PHP memory limit
echo "memory_limit = 256M" >> /etc/php82/php.ini

# Wait for MariaDB
while ! mariadb -h$DB_HOST -u$DB_USER -p$DB_PASSWORD -e "SELECT 1"; do
  echo "Waiting for MariaDB..."
  sleep 2
done

# Install WP-CLI as root
echo "[INFO] Install wp-cli.phar at $PWD"
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
mv wp-cli.phar /usr/local/bin/wp

# Create WordPress directory structure as root
mkdir -p $WP_PATH/wp-content/themes
mkdir -p $WP_PATH/wp-content/plugins
mkdir -p $WP_PATH/wp-content/uploads

# Set permissions again after creating directories
chown -R wpuser:incept $WP_PATH
chmod -R 775 $WP_PATH

# Move theme as root
mv /tmp/breevia $WP_PATH/wp-content/themes/breevia
chown -R wpuser:incept $WP_PATH/wp-content/themes/breevia

echo "NOW I am : $(whoami)" 
id $(whoami)

# Switch to wpuser for WordPress operations and PHP-FPM
exec su - wpuser -c "
# Double-check ownership before any operations
chown -R wpuser:incept $WP_PATH 2>/dev/null || true
chmod -R 775 $WP_PATH 2>/dev/null || true

# Download WordPress if not present
if [ ! -f \"$WP_PATH/wp-load.php\" ]; then
    echo \"[INFO] Downloading WordPress core...\"
    wp core download --path=$WP_PATH
else
    echo \"[INFO] WordPress already downloaded at $WP_PATH\"
fi

# Create wp-config if not exists
if [ ! -f \"$WP_PATH/wp-config.php\" ]; then
    echo \"[INFO] Create wp-config.php\"
    wp config create \
        --dbname=\"$DB_NAME\" \
        --dbuser=\"$DB_USER\" \
        --dbpass=\"$DB_PASSWORD\" \
        --dbhost=\"$DB_HOST\" \
        --path=$WP_PATH
else
    echo \"[INFO] wp-config.php already exists\"
fi

# Install WordPress if not installed
if ! wp core is-installed --path=$WP_PATH 2>/dev/null; then
    echo \"[INFO] Installing WordPress core...\"
    wp core install \
        --url=\"https://npolack.42.fr\" \
        --title=\"$SITE_TITLE\" \
        --admin_user=\"$WP_ADMIN_NAME\" \
        --admin_password=\"$WP_ADMIN_PASS\" \
        --admin_email=$WP_ADMIN_MAIL \
        --path=$WP_PATH
else
    echo \"[INFO] WordPress is already installed\"
fi

# Create editor user if not exists
if ! wp user get \"$WP_EDITOR_NAME\" --path=$WP_PATH 2>/dev/null; then
    echo \"[INFO] Creating editor user...\"
    wp user create \"$WP_EDITOR_NAME\" \"$WP_EDITOR_MAIL\" \
        --role=editor \
        --user_pass=\"$WP_EDITOR_PASS\" \
        --display_name=\"$WP_EDITOR_NAME\" \
        --path=$WP_PATH
else
    echo \"[INFO] Editor user already exists\"
fi

# Customize WordPress
echo \"[INFO] Customize Wordpress with theme & plugin\"
wp theme activate breevia --path=$WP_PATH
wp plugin install jetpack --activate --path=$WP_PATH
wp plugin install classic-editor --activate --path=$WP_PATH
wp plugin install redis-cache --activate --path=$WP_PATH

echo \"[INFO] Running as user: \$(whoami)\"
echo \"[INFO] Running as group: \$(id -gn)\"
echo \"[INFO] File ownership in $WP_PATH:\"
ls -la \"$WP_PATH\"

# Start PHP-FPM as wpuser
echo \"[INFO] Starting php-fpm82 as wpuser\"
exec /usr/sbin/php-fpm82 -F
"
