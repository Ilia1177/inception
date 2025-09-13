#!/bin/sh

echo "Starting hazardous HTML setup..."
echo "Running as: $(whoami)"
echo "User ID: $(id)"

# Ensure the target directory exists and fix ownership
mkdir -p /var/www/hazardous
chown -R 1000:1000 /var/www/hazardous

# Copy files to the correct location
cp -r /tmp/hazardous/* /var/www/hazardous/

# Set proper permissions
chmod -R 755 /var/www/hazardous
chown -R 1000:1000 /var/www/hazardous

echo "HTML files copied to /var/www/hazardous"
echo "Contents of /var/www/hazardous:"
ls -la /var/www/hazardous

# Keep container running (since this is likely a one-time setup)
echo "Setup complete. Files are now available in the shared volume."
#sleep infinity
exit 0
