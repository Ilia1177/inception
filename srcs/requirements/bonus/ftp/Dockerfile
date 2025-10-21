FROM alpine:3.21

RUN apk update && \
    apk add --no-cache \
    vsftpd \
    openssl \
    bash \
    shadow \
    busybox-extras \
    && rm -rf /var/cache/apk/*

# Create only system directories (user directories will be created by entrypoint)
RUN mkdir -p /var/run/vsftpd/empty \
    && mkdir -p /var/log/vsftpd \
    && mkdir -p /etc/ssl/private \
    && mkdir -p /etc/ssl/certs

# Set proper ownership for system directories only
RUN chown root:root /var/run/vsftpd/empty \
    && chown root:root /var/log/vsftpd \
    && chown root:root /etc/ssl/private \
    && chown root:root /etc/ssl/certs

# Copy configuration files
COPY docker-entrypoint.sh /usr/local/bin/
COPY conf/vsftpd.conf /etc/vsftpd/vsftpd.conf

# Make entrypoint executable
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set default environment variables (can be overridden)
# ENV FTP_USER=ftpuser
# ENV FTP_PASS=ftp_pass

# Expose FTP ports
EXPOSE 20 21 21000-21010

# Run as root (required for vsftpd and user management)
ENTRYPOINT ["docker-entrypoint.sh"]
