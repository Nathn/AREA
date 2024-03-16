#!/bin/bash

cd /apk

# start the shared volume server
http-server -p 8090 & # the & is to run the command in the background

cd /app

npm install --legacy-peer-deps

npm start
