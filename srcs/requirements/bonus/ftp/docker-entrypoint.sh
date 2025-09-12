#!/bin/bash

set -e

# Set FTP_USER and FTP_PASS from env (fallback to defaults)
FTP_USER="${FTP_USER:-ftpuser}"
FTP_PASS="${FTP_PASS:-$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 16)}"

# Ensure directories exist
mkdir -p /var/run/vsftpd/empty
mkdir -p /home/$FTP_USER/ftp/files
mkdir -p /var/log/vsftpd

# Create ftpuser group if it doesn't exist
#getent group ftpuser >/dev/null || addgroup -g 1000 ftpuser

# Create FTP user if it doesn't exist
#if ! id -u "$FTP_USER" &>/dev/null; then
#    adduser -D -h /home/$FTP_USER -s /sbin/nologin -u 1000 -G ftpuser $FTP_USER
#else
    # Ensure user is in ftpuser group
#    addgroup "$FTP_USER" ftpuser 2>/dev/null || true
#fi

# Set up directory ownership and permissions
# Home directory structure
chown -R $FTP_USER:$FTP_USER	 /home/$FTP_USER/
chown -R $FTP_USER:ftpuser 		/home/$FTP_USER/ftp/files
chown -R $FTP_USER:ftpuser		 /var/run/vsftpd/empty
chown -R $FTP_USER:ftpuser		 /var/log/vsftpd

# Set permissions
chmod -R g+w /home/$FTP_USER/ftp/files
chmod a-w /home/$FTP_USER/ftp
chmod a-w /home/$FTP_USER

# Ensure system directories have correct ownership
chown ftpuser:ftpuser /var/run/vsftpd/empty
chown ftpuser:ftpuser /var/log/vsftpd
#chown root:root /var/run/vsftpd/empty
#chown root:root /var/log/vsftpd

# Set password for the user
echo "$FTP_USER:$FTP_PASS" | chpasswd
echo "Set password for $FTP_USER: $FTP_PASS"

# Generate SSL cert if missing (shouldn't happen in this fixed version)
if [ ! -f /etc/ssl/certs/vsftpd.crt ]; then
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

# Start vsftpd as root (it will drop privileges as configured)
exec /usr/sbin/vsftpd /etc/vsftpd/vsftpd.conf
