#!/bin/bash

set -e

# Set FTP_USER and FTP_PASS from env (fallback to defaults)
FTP_USER="${FTP_USER:-ftpuser}"
FTP_PASS="${FTP_PASS:-$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 16)}"

# Set up FTP directory structure
mkdir -p /var/run/vsftpd/empty
mkdir -p /home/$FTP_USER/ftp/files

# Create shared group first
# addgroup ftpuser 2>/dev/null || true

# Create FTP user if it doesn't exist
if ! id -u "$FTP_USER" &>/dev/null; then
    adduser -D -h /home/$FTP_USER -s /sbin/nologin $FTP_USER
    # Add user to ftpuser group
    addgroup "$FTP_USER" ftpuser 2>/dev/null || true
fi

# Set up directory ownership and permissions
chown -R $FTP_USER:$FTP_USER /home/$FTP_USER/
# Set ownership with shared group for files directory (may take time due to volume)
chown -R $FTP_USER:ftpuser /home/$FTP_USER/ftp/files 2>/dev/null || true
# Give group write permissions
chmod -R g+w /home/$FTP_USER/ftp/files 2>/dev/null || true

# FTP directory should not be writable (chroot requirement)
chmod a-w /home/$FTP_USER/ftp
#chown $FTP_USER:ftpuser /home/$FTP_USER/ftp

# Remove write permissions on chroot directories
chmod a-w /home/$FTP_USER

# Set password for the user
echo "$FTP_USER:$FTP_PASS" | chpasswd
echo "Set password for $FTP_USER: $FTP_PASS"

# Generate SSL cert if missing
if [ ! -f /etc/ssl/certs/vsftpd.crt ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/ssl/private/vsftpd.key \
        -out /etc/ssl/certs/vsftpd.crt \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=ftp-server"
fi

# Substitute env variables in vsftpd.conf (e.g., PASV_ADDRESS)
sed -i "s|{{PASV_ADDRESS}}|${PASV_ADDRESS:-$(hostname -i)}|g" /etc/vsftpd/vsftpd.conf
sed -i "s|{{FTP_USER_DIR}}|/home/$FTP_USER/ftp|g" /etc/vsftpd/vsftpd.conf

/usr/sbin/vsftpd /etc/vsftpd/vsftpd.conf
