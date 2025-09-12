FROM alpine:3.21

# Install Node.js and npm
RUN apk add --no-cache nodejs npm

# Create app directory
WORKDIR /usr/src/app

# Create necessary directories with secure permissions
RUN mkdir -p /var/www/hazardous && \
    mkdir -p /usr/uploads && \
    mkdir -p ./public && \
    chmod 755 /var/www/hazardous && \
    chmod 755 /usr/uploads

# Copy package.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy application files
COPY . .

# Create a non-root user for security
#RUN addgroup -g 1000 -S nodejs && \
#    adduser -D -s /bin/sh -u 1000 -G nodejs nodejs && \
#    chown -R nodejs:nodejs /usr/src/app && \
#    chown -R nodejs:nodejs /var/www/hazardous && \
#    chown -R nodejs:nodejs /usr/uploads

#USER nodejs

# Expose port
EXPOSE 3000

# Health check
#HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the Node.js server
CMD ["node", "server.js"]
