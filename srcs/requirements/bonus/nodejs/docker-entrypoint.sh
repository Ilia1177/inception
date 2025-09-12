#!/bin/bash
set -e
chown -R 1000:1000 /usr/src/app/uploads
exec "$@"

