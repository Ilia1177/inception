FROM alpine:3.21

RUN apk update && apk upgrade && apk add --no-cache\
	tar	\
	wget \
    php82 \
    php82-fpm \
    php82-mysqli \
	php82-cli \
    php82-phar \
    php82-mbstring \
	php82-iconv \
    php82-json \
	php82-opcache \
	php82-curl \
	php82-gd \
	php82-xml \
	php82-ctype \
	php82-json \
	php82-tokenizer \
	php82-session \
	php82-dom \
	php82-fileinfo \
	php82-simplexml\
	php82-common \
	curl\
    mariadb-client\
	net-tools\
	iproute2\
	&& rm -rf /var/lib/apt/lists/*

RUN ln -s /usr/bin/php82 /usr/bin/php
COPY		html/				/tmp/html/
COPY		breevia/			/tmp/breevia/
COPY		conf/www.conf		/tmp/www.conf
COPY		conf/wp-config.php	/tmp/wp-config.php
COPY 		wp_init.sh	.
RUN			chmod 755 wp_init.sh
EXPOSE		9000

ENTRYPOINT	["./wp_init.sh"]
