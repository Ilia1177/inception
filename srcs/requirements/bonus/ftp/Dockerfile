FROM alpine:3.21

RUN apk update && \
    apk add --no-cache \
    vsftpd \
    openssl \
    bash \
	shadow \
	busybox-extras \
    && rm -rf /var/cache/apk/*

# Create a directory for the entrypoint script
RUN mkdir -p /docker-entrypoint.d
RUN mkdir -p /var/run/vsftpd/empty

# Copy entrypoint script and vsftpd config
COPY docker-entrypoint.sh /usr/local/bin/
COPY conf/vsftpd.conf /etc/vsftpd/vsftpd.conf

# Make entrypoint executable
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]


