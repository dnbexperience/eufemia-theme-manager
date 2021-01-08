#!/bin/bash

build_react() {
    echo 'Building React App ...'

    # react generate file name with hash
    # to make sure no deprecated files in dist
    # rm -rf dist-$REACT_APP_BROWSER/*

    # chrome extension doesn't allow inline script
    export INLINE_RUNTIME_CHUNK=false
    # prevent generating sourcemap
    export GENERATE_SOURCEMAP=false

    # react-app-rewired build generate by default PRODUCTION build
    react-app-rewired build

    # copy from build to dist, build could still be used by 'npm run start'
    mkdir -p dist-$REACT_APP_BROWSER
    
    cp -r build/* dist-$REACT_APP_BROWSER
    
    mv dist-$REACT_APP_BROWSER/index.html dist-$REACT_APP_BROWSER/popup.html
    cp dist-$REACT_APP_BROWSER/popup.html dist-$REACT_APP_BROWSER/options.html

    cp -r public/images dist-$REACT_APP_BROWSER
    
    # rm -rf build
}

build_extension() {
    echo 'Building extension ...'

    mkdir -p dist-$REACT_APP_BROWSER

    cp src/extension/manifest.json dist-$REACT_APP_BROWSER/manifest.json
    # cp src/extension/* dist-$REACT_APP_BROWSER
    
    rollup -c

}

if [ $# -eq 0 ]; then
    echo 'build react|extension'
fi

case $1 in
'react')
    build_react
    ;;
'extension')
    build_extension
    ;;
esac
