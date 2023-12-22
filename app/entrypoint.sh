#!/bin/bash

# If an apk already exists, copy it to /apk
if [ -f /app/build/app/outputs/apk/debug/app-debug.apk ]; then
  cp /app/build/app/outputs/apk/debug/app-debug.apk /apk/client.apk
fi

# cd android && ./gradlew assembleDebug && cd ..
sh -c "cd android && ./gradlew assembleDebug > /dev/null 2>&1 && cd .. && cp /app/android/app/build/outputs/apk/debug/app-debug.apk /apk/client.apk" &

# Run the app
npm install --legacy-peer-deps && npx expo start --tunnel
