#!/bin/bash

# If an apk already exists, copy it to /apk
if [ -f /app/build/app/outputs/apk/release/app-release.apk ]; then
  cp /app/build/app/outputs/apk/release/app-release.apk /apk/client.apk
fi

# Build new apk
flutter build apk

# Copy new apk to /apk
cp /app/build/app/outputs/apk/release/app-release.apk /apk/client.apk
