#!/bin/bash

APK_PATH=/app/build/app/outputs/apk/release/app-release.apk
DEST_PATH=/apk/client.apk

# If an apk already exists, copy it to /apk
if [ -f "$APK_PATH" ]; then
  cp "$APK_PATH" "$DEST_PATH"
  echo "Existing APK copied to $DEST_PATH"
else
  echo "No existing APK found at $APK_PATH"
fi

# Build new apk
flutter build apk

# Check if the new apk exists and copy it to /apk
if [ -f "$APK_PATH" ]; then
  cp "$APK_PATH" "$DEST_PATH"
  echo "Newly built APK copied to $DEST_PATH"
else
  echo "Error: APK not found at $APK_PATH. Build might have failed."
fi
