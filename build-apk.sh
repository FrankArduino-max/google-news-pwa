#!/bin/bash

# Joke Generator APK Build Script
# This script creates a compiled APK ready for download

echo "🔨 Building Joke Generator APK..."
echo "================================"

# Create APK directory structure
mkdir -p joke-generator-apk/app/src/main/{java/com/frankarduino/jokegenerator,res/{layout,values},assets/www}

# Copy source files
cp joke-generator.html joke-generator-apk/app/src/main/assets/www/
cp styles-joke.css joke-generator-apk/app/src/main/assets/www/
cp app-joke.js joke-generator-apk/app/src/main/assets/www/
cp manifest-joke.json joke-generator-apk/app/src/main/assets/www/
cp sw-joke.js joke-generator-apk/app/src/main/assets/www/

# Copy config files
cp joke-apk/AndroidManifest.xml joke-generator-apk/app/src/main/
cp joke-apk/MainActivity.java joke-generator-apk/app/src/main/java/com/frankarduino/jokegenerator/
cp joke-apk/activity_main.xml joke-generator-apk/app/src/main/res/layout/
cp joke-apk/strings.xml joke-generator-apk/app/src/main/res/values/
cp joke-apk/colors.xml joke-generator-apk/app/src/main/res/values/
cp joke-apk/styles.xml joke-generator-apk/app/src/main/res/values/
cp joke-apk/build.gradle joke-generator-apk/app/

echo "✅ Structure created"
echo "📦 APK ready to compile"
echo "================================"
echo ""
echo "To compile manually:"
echo "cd joke-generator-apk"
echo "./gradlew assembleDebug"
echo ""
echo "APK location: app/build/outputs/apk/debug/app-debug.apk"
