#!/bin/bash
set -e

# Set FTP_USER and FTP_PASS from env (fallback to defaults)
echo $FTP_USER
FTP_USER="${FTP_USER:-myUser}"
FTP_PASS="${FTP_PASS:-$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 16)}"

echo "[INFO] Setting up FTP server for user: $FTP_USER"

# Ensure directories exist
mkdir -p /var/run/vsftpd/empty
mkdir -p /home/$FTP_USER/ftp/files
mkdir -p /var/log/vsftpd

# Create group with same name as user and consistent GID if it doesn't exist
if ! getent group $FTP_USER >/dev/null; then
    addgroup -g 1000 $FTP_USER
    echo "[INFO] Created $FTP_USER group with GID 1000"
fi

# Create FTP user with consistent UID if it doesn't exist
if ! id -u "$FTP_USER" &>/dev/null; then
    adduser -D -h /home/$FTP_USER -s /sbin/nologin -u 1000 -G $FTP_USER $FTP_USER
    echo "[INFO] Created user $FTP_USER with UID 1000"
else
    # Ensure existing user is in their own group
    addgroup "$FTP_USER" $FTP_USER 2>/dev/null || true
    echo "[INFO] User $FTP_USER already exists"
fi

# Set up directory ownership and permissions
echo "[INFO] Setting up directory permissions..."
# Use consistent UID:GID (1000:1000)
chown -R 1000:1000 /home/$FTP_USER/
chown -R 1000:1000 /home/$FTP_USER/ftp/files
chown -R 1000:1000 /var/log/vsftpd

# Set permissions (secure FTP directory structure)
chmod 755 /home/$FTP_USER
chmod 755 /home/$FTP_USER/ftp
chmod 775 /home/$FTP_USER/ftp/files  # Allow group write

# vsftpd needs these as root
chown root:root /var/run/vsftpd/empty
chmod 755 /var/run/vsftpd/empty

# Set password for the user
echo "$FTP_USER:$FTP_PASS" | chpasswd
echo "[INFO] Set password for $FTP_USER: $FTP_PASS"

# Generate SSL cert if missing
if [ ! -f /etc/ssl/certs/vsftpd.crt ]; then
    echo "[INFO] Generating SSL certificate..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/ssl/private/vsftpd.key \
        -out /etc/ssl/certs/vsftpd.crt \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=ftp-server"
    chmod 600 /etc/ssl/private/vsftpd.key
    chmod 644 /etc/ssl/certs/vsftpd.crt
fi

# Substitute env variables in vsftpd.conf
sed -i "s|{{PASV_ADDRESS}}|${PASV_ADDRESS:-$(hostname -i)}|g" /etc/vsftpd/vsftpd.conf
sed -i "s|{{FTP_USER_DIR}}|/home/$FTP_USER/ftp|g" /etc/vsftpd/vsftpd.conf

echo "[INFO] Starting vsftpd server..."
# vsftpd MUST run as root - it handles user switching internally
exec /usr/sbin/vsftpd /etc/vsftpd/vsftpd.conf
