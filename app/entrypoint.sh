#!/bin/bash

flutter build apk
cp /app/build/app/outputs/apk/release/app-release.apk /apk/client.apk
