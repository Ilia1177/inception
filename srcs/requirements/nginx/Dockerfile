FROM alpine:3.21

RUN apk update && apk add --no-cache nginx openssl
RUN mkdir -p /run/nginx /etc/nginx/ssl /etc/nginx/conf
RUN mkdir -p /var/www/html && chmod 755 /var/www/html
RUN chown -R nobody:nobody /var/www/html

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/server.key \
  -out /etc/nginx/ssl/server.crt \
  -subj "/CN=localhost"

COPY conf/nginx.conf /etc/nginx/nginx.conf

RUN echo "<h1>Hello from Nginx on Alpine</h1>" > /var/www/html/index.html
CMD ["nginx", "-g", "daemon off;"]


#COPY srcs/nginx/index.html	/usr/share/nginx/html
