FROM alpine:3.21

ARG INCLUDE_BONUS=false

RUN apk update && apk add --no-cache nginx openssl netcat-openbsd

RUN mkdir -p /run/nginx /etc/nginx/ssl /etc/nginx/conf.d
RUN mkdir -p /var/www/html && chmod 755 /var/www/html

RUN addgroup -g 1000 nginxuser && \
    adduser -D -u 1000 -G nginxuser nginxuser

RUN chown -R nginxuser:nginxuser /var/www/html

RUN mkdir -p /tmp/nginx-client-body \
    && mkdir -p /tmp/nginx-proxy \
    && chown -R 1000:1000 /tmp/nginx-* \
    && chmod -R 700 /tmp/nginx-*

# Generate SSL certificates and set proper permissions
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/server.key \
  -out /etc/nginx/ssl/server.crt \
  -subj "/CN=localhost" && \
  chmod 644 /etc/nginx/ssl/server.crt && \
  chmod 600 /etc/nginx/ssl/server.key && \
  chown nginxuser:nginxuser /etc/nginx/ssl/server.key /etc/nginx/ssl/server.crt

COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY conf/bonus.conf /etc/nginx/conf.d/bonus.conf

# Set permissions for nginx directories and files that nginxuser needs access to
RUN chown -R nginxuser:nginxuser /etc/nginx && \
    chown -R nginxuser:nginxuser /run/nginx && \
    chown -R nginxuser:nginxuser /var/log/nginx

# Handle bonus configuration
RUN echo "INCLUDE_BONUS value: '$INCLUDE_BONUS'" && \
    ls -la /etc/nginx/conf.d/ && \
    if [ "$INCLUDE_BONUS" = "false" ]; then \
        echo "Condition matched, removing bonus.conf" && \
        rm -f /etc/nginx/conf.d/bonus.conf && \
        echo "removed bonus.conf"; \
    else \
        echo "Condition not matched, keeping bonus.conf"; \
    fi

# Remove USER directive - run as root and let nginx handle user switching
CMD ["nginx", "-g", "daemon off;"]
