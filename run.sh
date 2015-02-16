#!/bin/bash
dir=$(pwd)
url="http://localhost:8080"
node Node/main.js & processing-java --force --sketch="$dir/Processing/oscKinectSend" --output="$dir/Processing/oscKinectSend/build" --run &  /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome "$url/screen-graphs-skeleton.html" "$url/screen-words-audio.html" "$url/screen-results.html"

