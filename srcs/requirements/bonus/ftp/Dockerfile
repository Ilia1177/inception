FROM alpine:3.21

RUN apk update && \
    apk add --no-cache \
    vsftpd \
    openssl \
    bash \
	shadow \
    && rm -rf /var/cache/apk/*

# Create a directory for the entrypoint script
RUN mkdir -p /docker-entrypoint.d

# Copy entrypoint script and vsftpd config
COPY docker-entrypoint.sh /usr/local/bin/
COPY conf/vsftpd.conf /etc/vsftpd/vsftpd.conf

# Make entrypoint executable
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Default volumes
VOLUME /home/ftpuser/ftp/files

# Expose FTP ports
EXPOSE 20 21 21000-21010

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["vsftpd", "/etc/vsftpd/vsftpd.conf"]
