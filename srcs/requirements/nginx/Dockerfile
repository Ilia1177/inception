FROM alpine:3.21

RUN apk update && apk add --no-cache nginx openssl netcat-openbsd
RUN mkdir -p /run/nginx /etc/nginx/ssl /etc/nginx/conf
RUN mkdir -p /var/www/html && chmod 755 /var/www/html
RUN chown -R nobody:nobody /var/www/html

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/server.key \
  -out /etc/nginx/ssl/server.crt \
  -subj "/CN=localhost"

COPY conf/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
