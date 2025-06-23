FROM alpine:3.21

RUN apk update && apk upgrade
COPY		html/				/tmp/html/
COPY		html_script.sh/		/usr/local/bin/html_init.sh
RUN			chmod 755			/usr/local/bin/html_init.sh
ENTRYPOINT ["/usr/local/bin/html_init.sh"]
