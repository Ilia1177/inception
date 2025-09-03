#!/bin/sh

# Validate environment variables
if [ -z "$WP_PATH" ]; then
    echo "[ERROR] WP_PATH environment variable is not set!"
    exit 1
fi

if [ -z "$DB_NAME" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_HOST" ]; then
    echo "[ERROR] Database environment variables are not set!"
    exit 1
fi

echo "[INFO] WordPress installation script starting..."
echo "[INFO] WP_PATH: $WP_PATH"
echo "[INFO] Running as user: $(whoami)"
echo "[INFO] Running as group: $(id -gn)"

# Change to WordPress directory
cd "$WP_PATH" || { echo "[ERROR] Cannot change to WP_PATH: $WP_PATH"; exit 1; }

# Double-check ownership before any operations
chown -R wpuser:incept "$WP_PATH" 2>/dev/null || true
chmod -R 775 "$WP_PATH" 2>/dev/null || true

# Download WordPress if not present
if [ ! -f "$WP_PATH/wp-load.php" ]; then
    echo "[INFO] Downloading WordPress core..."
    wp core download --path="$WP_PATH"
else
    echo "[INFO] WordPress already downloaded at $WP_PATH"
fi

# Create wp-config if not exists
if [ ! -f "$WP_PATH/wp-config.php" ]; then
    echo "[INFO] Create wp-config.php"
    wp config create \
        --dbname="$DB_NAME" \
        --dbuser="$DB_USER" \
        --dbpass="$DB_PASSWORD" \
        --dbhost="$DB_HOST" \
        --path="$WP_PATH"
else
    echo "[INFO] wp-config.php already exists"
fi

# Install WordPress if not installed
if ! wp core is-installed --path="$WP_PATH" 2>/dev/null; then
    echo "[INFO] Installing WordPress core..."
    wp core install \
        --url="https://npolack.42.fr" \
        --title="$SITE_TITLE" \
        --admin_user="$WP_ADMIN_NAME" \
        --admin_password="$WP_ADMIN_PASS" \
        --admin_email="$WP_ADMIN_MAIL" \
        --path="$WP_PATH"
else
    echo "[INFO] WordPress is already installed"
fi

# Create editor user if not exists
if ! wp user get "$WP_EDITOR_NAME" --path="$WP_PATH" 2>/dev/null; then
    echo "[INFO] Creating editor user..."
    wp user create "$WP_EDITOR_NAME" "$WP_EDITOR_MAIL" \
        --role=editor \
        --user_pass="$WP_EDITOR_PASS" \
        --display_name="$WP_EDITOR_NAME" \
        --path="$WP_PATH"
else
    echo "[INFO] Editor user already exists"
fi

# Customize WordPress
echo "[INFO] Customize Wordpress with theme & plugin"
wp theme activate breevia --path="$WP_PATH" 2>/dev/null || echo "[WARN] Could not activate breevia theme"
wp plugin install jetpack --activate --path="$WP_PATH" 2>/dev/null || echo "[WARN] Could not install jetpack"
wp plugin install classic-editor --activate --path="$WP_PATH" 2>/dev/null || echo "[WARN] Could not install classic-editor"
wp plugin install redis-cache --activate --path="$WP_PATH" 2>/dev/null || echo "[WARN] Could not install redis-cache"

echo "[INFO] File ownership in $WP_PATH:"
ls -la "$WP_PATH"

# Start PHP-FPM as wpuser
echo "[INFO] Starting php-fpm82 as wpuser"
exec /usr/sbin/php-fpm82 -F
