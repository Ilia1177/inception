FROM alpine:3.21

RUN apk update && \
    apk add --no-cache \
    vsftpd \
    openssl \
    bash \
    shadow \
    busybox-extras \
    && rm -rf /var/cache/apk/*

# Create ftpuser group and user with specific IDs
RUN addgroup -g 1000 -S ftpuser && \
    adduser -D -s /sbin/nologin -u 1000 -G ftpuser ftpuser

# Create necessary directories with proper permissions
RUN mkdir -p /var/run/vsftpd/empty \
    && mkdir -p /var/log/vsftpd \
    && mkdir -p /etc/ssl/private \
    && mkdir -p /etc/ssl/certs \
    && mkdir -p /home/ftpuser/ftp/files

# Set proper ownership for system directories
#RUN chown root:root /var/run/vsftpd/empty \
#    && chown root:root /var/log/vsftpd \
#    && chown root:root /etc/ssl/private \
#    && chown root:root /etc/ssl/certs

RUN chown root:root /var/run/vsftpd/empty \
    && chown ftpuser:ftpuser /var/log/vsftpd \
    && chown ftpuser:ftpuser /etc/ssl/private \
    && chown ftpuser:ftpuser /etc/ssl/certs

# Set up FTP user home directory
RUN chown -R ftpuser:ftpuser /home/ftpuser/ \
    && chmod -R g+w /home/ftpuser/ftp/files \
    && chmod a-w /home/ftpuser/ftp \
    && chmod a-w /home/ftpuser

# Generate SSL certificates
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/vsftpd.key \
    -out /etc/ssl/certs/vsftpd.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=ftp-server" \
    && chmod 600 /etc/ssl/private/vsftpd.key \
    && chmod 644 /etc/ssl/certs/vsftpd.crt

# Copy configuration files
COPY docker-entrypoint.sh /usr/local/bin/
COPY conf/vsftpd.conf /etc/vsftpd/vsftpd.conf

# Make entrypoint executable
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set environment variables
ENV FTP_USER=ftpuser
ENV FTP_PASS=ftp_pass

# Expose FTP ports
EXPOSE 20 21 21000-21010

# Run as root (required for vsftpd)
ENTRYPOINT ["docker-entrypoint.sh"]
