FROM alpine:3.21

RUN apk update && \
    apk add --no-cache \
    vsftpd \
    openssl \
    bash \
	shadow \
	busybox-extras \
    && rm -rf /var/cache/apk/*

# Create user and group for ftpuser (1000:1000)
RUN addgroup -g 1000 -S ftpuser && \
    adduser -D -s /bin/sh -u 1000 -G ftpuser ftpuser
    
# Create necessary directories
RUN mkdir -p /docker-entrypoint.d \
    && mkdir -p /var/run/vsftpd/empty \
    && mkdir -p /var/log/vsftpd \
    && mkdir -p /etc/ssl/private \
    && mkdir -p /etc/ssl/certs  \
    && chown -R ftpuser:ftpuser /var/run/vsftpd/empty \
    && chown -R ftpuser:ftpuser /var/log/vsftpd \
    && chown -R ftpuser:ftpuser /etc/ssl/private \
    && chown -R ftpuser:ftpuser /etc/ssl/certs 


# Set environment variables with defaults
ENV FTP_USER=ftpuser
ENV FTP_PASS=ftp_pass

# Create user and group during build time (as root)
RUN mkdir -p /home/$FTP_USER/ftp/files \
    && chown -R $FTP_USER:ftpuser /home/$FTP_USER/ \
    && chmod -R g+w /home/$FTP_USER/ftp/files \
    && chmod a-w /home/$FTP_USER/ftp \
    && chmod a-w /home/$FTP_USER

# Generate SSL certificates during build
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/vsftpd.key \
    -out /etc/ssl/certs/vsftpd.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=ftp-server" \
    && chmod 600 /etc/ssl/private/vsftpd.key \
    && chmod 644 /etc/ssl/certs/vsftpd.crt

# Copy entrypoint script and vsftpd config
COPY docker-entrypoint.sh /usr/local/bin/
COPY conf/vsftpd.conf /etc/vsftpd/vsftpd.conf

# Make entrypoint executable
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set up permissions for vsftpd to run as non-root
RUN chown -R $FTP_USER:ftpuser /var/log/vsftpd \
    && chmod -R 755 /var/log/vsftpd

# The actual user switch will be handled by docker-compose user directive
# But we prepare everything to work with it
ENTRYPOINT ["docker-entrypoint.sh"]

