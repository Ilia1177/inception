FROM alpine:3.21

# Install Node.js and npm
RUN apk add --no-cache nodejs npm

# Create app directory
WORKDIR /usr/src/app

# Create necessary directories with secure permissions
RUN mkdir -p /var/www/hazardous && \
    mkdir -p /usr/src/app/uploads && \
    mkdir -p /usr/src/app/public && \
    chmod 755 /var/www/hazardous && \
    chmod 755 /usr/src/app/uploads && \
	chown -R 1000:1000 /usr/src/app/uploads && \
	chown -R 1000:1000 /var/www/hazardous

# Copy package.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy application files
COPY . .
COPY docker-entrypoint.sh /tmp/docker-entrypoint.sh
RUN echo "docker file copied"
RUN chmod +x /tmp/docker-entrypoint.sh
# Create a non-root user for security
RUN addgroup -g 1000 -S nodejs && \
    adduser -D -s /bin/sh -u 1000 -G nodejs nodejs && \
    chown -R nodejs:nodejs /usr/src/app && \
    chown -R nodejs:nodejs /var/www/hazardous && \
    chown nodejs:nodejs /tmp/docker-entrypoint.sh

USER nodejs

# Expose port
EXPOSE 3000

# Health check
#HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the Node.js server
RUN cat /tmp/docker-entrypoint.sh
ENTRYPOINT ["/bin/sh", "/tmp/docker-entrypoint.sh"]
CMD ["node", "server.js"]
