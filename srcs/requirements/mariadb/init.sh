#!/bin/sh
# Validate required env vars
echo "$DB_NAME = DB_NAME"
echo "$DB_USER = DB_USER"
echo "$DB_PASSWORD = DB_PASSWORD"
echo "$DB_ROOTPASS = DB_ROOTPASS"

mariadb --version
# Ensure socket dir exists
mkdir -p /run/mysqld
chown mysql:mysql /run/mysqld

# Check permissions
if [ ! -w /var/lib/mysql ]; then
  echo "[ERROR] /var/lib/mysql is not writable by mysql user"
  ls -ld /var/lib/mysql
  echo -n "[DEBUG] user is $(whoami) with "
  id $(whoami)
  exit 1
else
  echo -n "[INFO] Permission granted on /var/lib/mysql for $(whoami) of "
  id $(whoami)
fi

# Initialize database if not already done
if [ ! -d "/var/lib/mysql/mysql" ]; then
  echo "[INFO] Initializing database..."
  chown -R mysql:mysql /var/lib/mysql
  mariadb-install-db --user=mysql --datadir=/var/lib/mysql --basedir=/usr
fi

# Start temporary server in background
echo "[INFO] Starting MariaDB in bootstrap mode..."
mariadbd-safe --user=mysql --skip-networking --skip-grant-tables >/dev/null 2>&1 &

# Wait for server to start
echo "[INFO] Waiting for server to start..."
i=0
while [ $i -lt 30 ]; do
  mariadb-admin ping -u root -p"${DB_ROOTPASS}" && break
  sleep 1
  i=$((i + 1))
done

if [ $i -gt 30 ]; then
  echo "[ERROR] MariaDB did not start in time"
  exit 1
fi

# Configure database and users
echo "[INFO] Configuring database..."

sql_script=$(cat <<EOF
	FLUSH PRIVILEGES;

	-- Secure root account
	ALTER USER 'root'@'localhost' IDENTIFIED BY '${DB_ROOTPASS}';
	DELETE FROM mysql.user WHERE User='';
	DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');
	DROP DATABASE IF EXISTS test;

	-- Create application database
	CREATE DATABASE IF NOT EXISTS ${DB_NAME};

	-- Create and verify super user
	CREATE USER IF NOT EXISTS '${DB_USER}'@'%' IDENTIFIED BY '${DB_PASSWORD}';
	GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'%';

	-- Verify user creation
	SELECT User, Host FROM mysql.user WHERE User = '${DB_USER}';

	FLUSH PRIVILEGES;
EOF
)

echo "$sql_script" | mariadb -u root -p"$DB_ROOTPASS"

# Verify user can connect before proceeding
mariadb -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1" || {
  echo "[ERROR] Failed to verify super user creation"
  exit 1
}

# Shutdown temporary server
echo "[INFO] Shutting down temporary server..."
mariadb-admin shutdown -u root -p"$DB_ROOTPASS"

# Start production server in foreground
echo "[INFO] Starting production MariaDB server..."
exec mariadbd-safe --user=mysql --console
#mariadb --user=mysql --console
