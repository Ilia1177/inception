FROM alpine:3.21

# Install PHP and necessary extensions
RUN apk update && apk upgrade
RUN apk add --no-cache php82 php82-fpm php82-mysqli php82-session curl netcat-openbsd

# Download Adminer
RUN curl -fSL -o /tmp/index.php https://github.com/vrana/adminer/releases/download/v5.3.0/adminer-5.3.0.php

RUN chmod 755 /tmp/index.php

COPY	conf/www.conf		/tmp/www.conf
COPY 	adminer_init.sh 	/usr/local/bin/adminer_init.sh 
RUN 	chmod 755			/usr/local/bin/adminer_init.sh
# Run PHP built-in web server
#CMD ["php", "-S", "0.0.0.0:8080", "-t", "/var/www"]
ENTRYPOINT ["/usr/local/bin/adminer_init.sh"]
