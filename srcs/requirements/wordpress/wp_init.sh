#!/bin/sh

mkdir -p $WP_PATH
chown -R nobody:nobody $WP_PATH
cp /tmp/www.conf /etc/php82/php-fpm.d/www.conf
#cp /tmp/wp-config.php /var/www/wordpress/wp-config.php
echo "memory_limit = 256M" >> /etc/php82/php.ini

while ! mariadb -h$DB_HOST -u$DB_USER -p$DB_PASSWORD -e "SELECT 1"; do
  echo "Waiting for MariaDB..."
  sleep 2
done

echo "[INFO] Install wp-cli.phar at $PWD"
curl -O		https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x	wp-cli.phar
mv			wp-cli.phar /usr/local/bin/wp


if [ ! -f "$WP_PATH/wp-load.php" ]; then
	echo "[INFO] Downloading WordPress core..."
	wp core download --path=$WP_PATH --allow-root;
else
	echo "[INFO] WordPress already downloaded at $WP_PATH";
fi

if [ ! -f "$WP_PATH/wp-config.php" ]; then
	echo "[INFO] Create wp-config.php";
	wp config create \
		--dbname="$DB_NAME" \
		--dbuser="$DB_USER" \
		--dbpass="$DB_PASSWORD" \
		--dbhost="$DB_HOST" \
		--path=$WP_PATH \
		--allow-root
else
	echo "[INFO] wp-config.php allready exists";
fi

wp core install \
	--url="https://localhost" \
	--title="$SITE_TITLE" \
	--admin_user="$WP_ADMIN_NAME" \
	--admin_password="$WP_ADMIN_PASS" \
	--admin_email=$WP_ADMIN_MAIL \
	--path=$WP_PATH \
	--allow-root

wp user create $WP_EDITOR_NAME $WP_EDITOR_MAIL \
  --role=editor \
  --user_pass=$WP_EDITOR_PASS \
  --display_name=$WP_EDITOR_NAME \
  --allow-root \
  --path=$WP_PATH

echo "[INFO] Customize Wordpress with breevia theme"
mv /tmp/breevia $WP_PATH/wp-content/themes/breevia
wp theme activate breevia --allow-root --path=$WP_PATH
wp plugin install jetpack --activate --allow-root --path=$WP_PATH;
wp plugin install classic-editor --activate --allow-root --path=$WP_PATH;
#wp rewrite structure '/%postname%/' --hard --allow-root
#wp rewrite flush --allow-root

echo "[INFO] run php82"; 
exec /usr/sbin/php-fpm82 -F;

