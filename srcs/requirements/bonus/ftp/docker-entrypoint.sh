#!/bin/bash
set -e

# Set FTP_USER and FTP_PASS from env (fallback to defaults)
FTP_USER="${FTP_USER:-ftpuser}"
FTP_PASS="${FTP_PASS:-$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 16)}"

# Create FTP user if it doesn't exist
if ! id -u "$FTP_USER" &>/dev/null; then
    adduser -D -g "$FTP_USER" "$FTP_USER"
    echo "$FTP_USER:$FTP_PASS" | chpasswd
    echo "Generated password for $FTP_USER: $FTP_PASS"
fi

# Set up FTP directory structure
mkdir -p /var/run/vsftpd/empty
mkdir -p /home/$FTP_USER/ftp/files

chown -R $FTP_USER:$FTP_USER /home/$FTP_USER/ftp/files
chmod a-w /home/$FTP_USER/ftp
# Set correct ownership
chown $FTP_USER:$FTP_USER /home/ftpuser/ftp

# Remove write permissions on chroot directories
chmod a-w /home/ftpuser

# Generate SSL cert if missing
if [ ! -f /etc/ssl/certs/vsftpd.crt ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/ssl/private/vsftpd.key \
        -out /etc/ssl/certs/vsftpd.crt \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=ftp-server"
fi

# Substitute env variables in vsftpd.conf (e.g., PASV_ADDRESS)
sed -i "s|{{PASV_ADDRESS}}|${PASV_ADDRESS:-$(hostname -i)}|g" /etc/vsftpd/vsftpd.conf

exec "$@"
