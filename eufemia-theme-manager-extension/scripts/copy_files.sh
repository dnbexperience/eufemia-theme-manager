#!/bin/bash

echo 'Copy files ...'

mkdir -p dist-$RUNTIME_BROWSER

cp src/extension/manifest.json dist-$RUNTIME_BROWSER/manifest.json
cp public/index.html dist-$RUNTIME_BROWSER/popup.html
cp public/index.html dist-$RUNTIME_BROWSER/options.html
cp -r public/images dist-$RUNTIME_BROWSER
