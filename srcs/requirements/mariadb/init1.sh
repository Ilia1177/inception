#!/bin/sh

# Initialize database if not already done
if [ ! -d "/var/lib/mysql/mysql" ]; then
  echo "[INFO] Initializing database..."
  mysql_install_db --user=mysql --datadir=/var/lib/mysql --basedir=/usr
  chown -R mysql:mysql /var/lib/mysql
fi

echo "[INFO] Starting MariaDB in bootstrap mode..."
# Start temporary server in background
mysqld_safe --user=mysql --skip-networking --skip-grant-tables >/dev/null 2>&1 &

# Wait for server to start with timeout
echo "[INFO] Waiting for server to start..."
for i in {1..30}; do
  mysqladmin ping -uroot --silent && break
  sleep 1
done

# Configure database and users
echo "[INFO] Configuring database..."
mysql -u root <<-EOSQL
  FLUSH PRIVILEGES;
  
  -- Secure root account
  ALTER USER 'root'@'localhost' IDENTIFIED BY '$DB_ROOTPASS';
  DELETE FROM mysql.user WHERE User='';
  DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');
  DROP DATABASE IF EXISTS test;
  
  -- Create application database
  CREATE DATABASE IF NOT EXISTS $DB_NAME;
  
  -- Create and verify super user
  CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASSWORD';
  GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'%';
  GRANT ALL PRIVILEGES ON *.* TO '$DB_USER'@'%' WITH GRANT OPTION;
  GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'%' IDENTIFIED BY '$DB_PASSWORD';
  
  -- Verify user creation
  SELECT User, Host FROM mysql.user WHERE User = '$DB_USER';
  
  FLUSH PRIVILEGES;
EOSQL

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
