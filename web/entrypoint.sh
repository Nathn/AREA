#!/bin/bash

#WORKDIR /apk

#RUN http-server -p 8090

#WORKDIR /app

#CMD [ "sh", "-c", "npm install --legacy-peer-deps && npm start" ]

cd /apk

http-server -p 8090 &

cd /app

npm install --legacy-peer-deps

npm start
