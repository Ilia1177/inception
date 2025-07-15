FROM alpine:3.21

RUN apk update && apk upgrade
COPY		hazardous/				/tmp/hazardous/
COPY		load_html.sh/		/usr/local/bin/load_html.sh
RUN			chmod 755			/usr/local/bin/load_html.sh
ENTRYPOINT ["/usr/local/bin/load_html.sh"]
