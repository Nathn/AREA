#!/bin/bash

# If an apk already exists, copy it to /apk
if [ -f /app/build/app/outputs/apk/release/app-release.apk ]; then
  cp /app/build/app/outputs/apk/release/app-release.apk /apk/client.apk
fi

sh -c "cd android && ./gradlew assembleRelease > /dev/null 2>&1 && cd .. && cp /app/android/app/build/outputs/apk/release/app-release.apk /apk/client.apk" &

# Run the app
npm install --legacy-peer-deps && npx expo start --tunnel
