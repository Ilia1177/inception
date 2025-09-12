FROM alpine:3.21

ARG INCLUDE_BONUS=false

RUN apk update && apk add --no-cache nginx openssl netcat-openbsd


RUN mkdir -p /run/nginx /etc/nginx/ssl /etc/nginx/conf
RUN mkdir -p /var/www/html && chmod 755 /var/www/html

RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G nginxuser nginxuser

RUN chown -R nginxuser:nginxuser /var/www/html

RUN mkdir -p /tmp/nginx-client-body \
    && mkdir -p /tmp/nginx-proxy \
    && chown -R nginxuser:nginxuser /tmp/nginx-* \
    && chmod -R 700 /tmp/nginx-*

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/server.key \
  -out /etc/nginx/ssl/server.crt \
  -subj "/CN=localhost"

COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY conf/bonus.conf /etc/nginx/conf.d/bonus.conf

USER nginxuser

RUN if [ "$INCLUDE_BONUS" = "false" ]; then rm -f /etc/nginx/conf.d/bonus.conf && echo "removed bonus.conf"; fi
CMD ["nginx", "-g", "daemon off;"]
