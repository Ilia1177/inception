#!/bin/bash
set -e

# Set FTP_USER and FTP_PASS from env (defaults if not provided)
FTP_USER="${FTP_USER:-ftpuser}"
FTP_PASS="${FTP_PASS:-$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 16)}"

# Create FTP user if it doesn't exist
if ! id -u "$FTP_USER" &>/dev/null; then
    adduser -D -g "$FTP_USER" "$FTP_USER"
    echo "$FTP_USER:$FTP_PASS" | chpasswd
    echo "Generated password for $FTP_USER: $FTP_PASS"
fi

# Prepare chroot + data dirs
mkdir -p /var/run/vsftpd/empty
mkdir -p /home/$FTP_USER/ftp/files

# Permissions
chown -R $FTP_USER:$FTP_USER /home/$FTP_USER/ftp
chmod a-w /home/$FTP_USER     # Home not writable
chmod 755 /home/$FTP_USER/ftp # FTP dir
chown -R $FTP_USER:$FTP_USER /home/$FTP_USER/ftp/files

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

