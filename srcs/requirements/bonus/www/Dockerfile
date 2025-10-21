##FROM alpine:3.21
##
##RUN apk update && apk upgrade
##COPY		hazardous/				/tmp/hazardous/
##COPY		load_html.sh/		/usr/local/bin/load_html.sh
##RUN			chmod 755			/usr/local/bin/load_html.sh
##ENTRYPOINT ["/usr/local/bin/load_html.sh"]
#FROM alpine:3.21
#
#RUN apk update && apk upgrade
#
## Create the target directory with proper permissions
#RUN mkdir -p /var/www/hazardous && \
#    addgroup -g 1000 webgroup && \
#    adduser -D -u 1000 -G webgroup webuser && \
#    chown -R 1000:1000 /var/www/hazardous
#
#COPY hazardous/ /tmp/hazardous/
#COPY load_html.sh /usr/local/bin/load_html.sh
#RUN chmod 755 /usr/local/bin/load_html.sh
#
## Set ownership of copied files
#RUN chown -R 1000:1000 /tmp/hazardous/
#
#USER 1000:1000
#ENTRYPOINT ["/usr/local/bin/load_html.sh"]
FROM alpine:3.21

RUN apk update && apk upgrade

# Create the target directory with proper permissions
RUN mkdir -p /var/www/hazardous && \
    addgroup -g 1000 webgroup && \
    adduser -D -u 1000 -G webgroup webuser

COPY hazardous/ /tmp/hazardous/
COPY load_html.sh /usr/local/bin/load_html.sh
RUN chmod 755 /usr/local/bin/load_html.sh

# Set ownership of copied files
RUN chown -R 1000:1000 /tmp/hazardous/

# Run as root to fix volume permissions, then the script can handle ownership
ENTRYPOINT ["/usr/local/bin/load_html.sh"]
