FROM alpine:3.21

# VOLUME /var/lib/mysql

RUN apk update && apk upgrade && apk add --no-cache\
	mariadb\
	net-tools\
	mariadb-client\
	mariadb-server-utils\
	shadow \
	pwgen \
	&& rm -f /var/cache/apk/*

RUN groupadd -g 1000 mysql && \
    useradd -r -u 1000 -g mysql mysql

RUN mkdir -p /run/mysqld && chown -R mysql:mysql /run/mysqld
RUN rm -f /etc/my.cnf && rm -f /etc/my.cnf.d/mariadb-server.cnf

COPY conf/my.cnf				/etc/my.cnf
COPY conf/mariadb-server.cnf	/etc/my.cnf.d/mariadb-server.cnf
COPY docker-entrypoint.sh		/usr/local/bin/docker-entrypoint.sh
RUN	chmod +x					/usr/local/bin/docker-entrypoint.sh
EXPOSE 3306
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
