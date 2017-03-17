#!/bin/bash

echo "Initializing..."

if [ $APP_ENV == "development" ]
then
    echo $APP_ENV
    cp -R /build-development/. /usr/share/nginx/html
fi

if [ $APP_ENV == "stage" ]
then
    echo $APP_ENV
    cp -R /build-production/. /usr/share/nginx/html
    sed -i 's/production/stage/g' /usr/share/nginx/html/index.html
fi

if [ $APP_ENV == "production" ]
then
    echo $APP_ENV
    cp -R /build-production/. /usr/share/nginx/html
fi

echo  "Starting server..."

nginx -g "daemon off;"
