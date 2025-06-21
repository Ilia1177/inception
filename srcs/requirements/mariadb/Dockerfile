FROM alpine:3.21

RUN apk update && apk upgrade && apk add --no-cache\
	mariadb\
	net-tools\
	mariadb-client\
	mariadb-server-utils\
	shadow \
	pwgen \
	&& rm -f /var/cache/apk/*

RUN mkdir -p /run/mysqld && chown -R mysql:mysql /run/mysqld

RUN rm -f /etc/my.cnf && rm -f /etc/my.cnf.d/mariadb-server.cnf

COPY conf/my.cnf				/etc/my.cnf
COPY conf/mariadb-server.cnf	/etc/my.cnf.d/mariadb-server.cnf
COPY init.sh					/usr/local/bin/init.sh

RUN chmod +x /usr/local/bin/init.sh
#USER mysql
EXPOSE 3306

ENTRYPOINT ["/usr/local/bin/init.sh"]
