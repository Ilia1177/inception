#!/bin/sh
# Validate required env vars
echo "$DB_NAME = DB_NAME"
echo "$DB_USER = DB_USER}"
echo "$DB_PASSWORD = DB_PASSWORD"
echo "$DB_ROOTPASS = DB_ROOTPASS"

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
  mysql_install_db --user=mysql --datadir=/var/lib/mysql --basedir=/usr
fi

# Start temporary server in background
echo "[INFO] Starting MariaDB in bootstrap mode..."
mysqld_safe --user=mysql --skip-networking --skip-grant-tables >/dev/null 2>&1 &

# Wait for server to start with timeout
echo "[INFO] Waiting for server to start..."
i=0
while [ $i -lt 30 ]; do
  mariadb-admin ping -uroot --silent && break
  sleep 1
  i=$((i + 1))
done

# Wait for actual SQL queries to work
for i in $(seq 1 10); do
  echo "SELECT 1" | mariadb -u root && break || sleep 1
done

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

echo "$sql_script" | mysql -u root

# Verify user can connect before proceeding
mysql -u $DB_USER -p$DB_PASSWORD -e "SELECT 1" || {
  echo "[ERROR] Failed to verify super user creation"
  exit 1
}

# Shutdown temporary server
echo "[INFO] Shutting down temporary server..."
mysqladmin -u root -p$DB_ROOTPASS shutdown

# Start production server in foreground
echo "[INFO] Starting production MariaDB server..."
exec mysqld_safe --user=mysql --console
#mariadb --user=mysql --console
