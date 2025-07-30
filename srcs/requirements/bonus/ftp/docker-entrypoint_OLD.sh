#!/bin/bash
set -e

# Function to handle shutdown gracefully
shutdown() {
    echo "Shutting down FTP server..."
    if [ -f /var/run/vsftpd.pid ]; then
        kill -TERM $(cat /var/run/vsftpd.pid)
        wait $(cat /var/run/vsftpd.pid) 2>/dev/null || true
    fi
    exit 0
}

# Trap SIGTERM and SIGINT
trap shutdown TERM INT

# Set default FTP credentials if not provided
FTP_USER=${FTP_USER:-ftpuser}
FTP_PASSWORD=${FTP_PASSWORD:-ftppass}

echo "Setting up FTP server..."

# Create or update FTP user
if id "$FTP_USER" &>/dev/null; then
    echo "User $FTP_USER already exists, updating password..."
else
    echo "Creating FTP user: $FTP_USER"
    adduser -D -s /bin/bash "$FTP_USER"
fi

# Set user password
echo "$FTP_USER:$FTP_PASSWORD" | chpasswd

# Add user to ftpgroup if it exists
if getent group ftpgroup > /dev/null 2>&1; then
    usermod -a -G ftpgroup "$FTP_USER"
fi

# Create user's home directory if it doesn't exist
USER_HOME=$(getent passwd "$FTP_USER" | cut -d: -f6)
if [ ! -d "$USER_HOME" ]; then
    mkdir -p "$USER_HOME"
    chown "$FTP_USER:$FTP_USER" "$USER_HOME"
fi

# Ensure WordPress directory exists and has correct permissions
if [ ! -d "/var/ftp/wordpress" ]; then
    mkdir -p /var/ftp/wordpress
fi

# Set permissions for WordPress directory
chown -R "$FTP_USER:$FTP_USER" /var/ftp/wordpress
chmod 755 /var/ftp/wordpress

# Update vsftpd configuration with dynamic values
CONFIG_FILE="/etc/vsftpd/vsftpd.conf"

# Set passive address to container IP or external IP if provided
if [ -n "$PASV_ADDRESS" ]; then
    sed -i "s/pasv_address=.*/pasv_address=$PASV_ADDRESS/" "$CONFIG_FILE"
else
    # Remove pasv_address line to use automatic detection
    sed -i "/pasv_address=/d" "$CONFIG_FILE"
fi

# Set passive port range if provided
if [ -n "$PASV_MIN_PORT" ] && [ -n "$PASV_MAX_PORT" ]; then
    sed -i "s/pasv_min_port=.*/pasv_min_port=$PASV_MIN_PORT/" "$CONFIG_FILE"
    sed -i "s/pasv_max_port=.*/pasv_max_port=$PASV_MAX_PORT/" "$CONFIG_FILE"
fi

# Enable/disable anonymous access
if [ "$ANONYMOUS_ENABLE" = "YES" ]; then
    sed -i "s/anonymous_enable=NO/anonymous_enable=YES/" "$CONFIG_FILE"
fi

# Set custom banner if provided
if [ -n "$FTP_BANNER" ]; then
    sed -i "s/ftpd_banner=.*/ftpd_banner=$FTP_BANNER/" "$CONFIG_FILE"
fi

echo "FTP server configuration:"
echo "  User: $FTP_USER"
echo "  WordPress directory: /var/ftp/wordpress"
echo "  Passive ports: $(grep pasv_min_port "$CONFIG_FILE" | cut -d= -f2)-$(grep pasv_max_port "$CONFIG_FILE" | cut -d= -f2)"

# Create necessary directories
mkdir -p /var/run/vsftpd/empty
mkdir -p /var/log/vsftpd

# Ensure log file exists
touch /var/log/vsftpd/vsftpd.log

# Display connection info
echo "FTP server is starting..."
echo "Connect with: ftp://localhost:21"
echo "Username: $FTP_USER"
echo "Password: [hidden]"

# Start vsftpd
if [ "$1" = 'vsftpd' ]; then
    echo "Starting vsftpd with config: $2"
    exec "$@"
fi

# Execute any other command
exec "$@"
