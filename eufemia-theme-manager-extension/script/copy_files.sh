#!/bin/bash

echo 'Copy files ...'

mkdir -p dist-$REACT_APP_BROWSER

cp src/extension/manifest.json dist-$REACT_APP_BROWSER/manifest.json
cp public/index.html dist-$REACT_APP_BROWSER/popup.html
cp public/index.html dist-$REACT_APP_BROWSER/options.html
cp -r public/images dist-$REACT_APP_BROWSER
