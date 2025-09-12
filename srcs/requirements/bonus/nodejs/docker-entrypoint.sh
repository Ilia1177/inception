#!/bin/bash

chown -R 1000:1000 /usr/uploads
exec "$@"

