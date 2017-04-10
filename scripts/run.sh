#!/bin/bash

echo "Initializing..."

if [ $NODE_ENV == "development" ]
then
    echo $NODE_ENV
    cp -R /build-development/. /usr/share/nginx/html
fi

if [ $NODE_ENV == "production" ]
then
    echo $NODE_ENV
    cp -R /build-production/. /usr/share/nginx/html
fi

echo  "Starting server..."

nginx -g "daemon off;"
