##Installation

- Install Processing (v2.0 or above)
- Install Simple OpenNI Processing library [instructions](https://code.google.com/p/simple-openni/wiki/Installation?ts=1377782923&updated=Installation)
- Install OSC P5 Processing Library [source](http://www.sojamo.de/libraries/oscP5/)
- Install Leap/Air Space [https://www.leapmotion.com/setup](https://www.leapmotion.com/setup)
- Install Google Chrome [source](http://www.google.com/chrome)
- Install node.js & npm [nodejs.org](http://nodejs.org/)
- download code
- cd into directory & run npm install
- rename Node/config/twitter-example.js as Node/config/twitter.js and populate with twitter credentials.



##Running

- Run Processing/oscKinectSend/oscKinectSend.pde
- Run node Node/main.js
- visit http://localhost:8080 in Chrome.


##Adjusting

###Query Sources

New, Kimono based query sources can be added easily. The file to edit is ```Node/public/assets/javascript/modules/QueryMaker.js```.

Beginning on line 2, there's a this.queries object that expects to have Kimono objects inside it. These should be configured like so:

new Kimono( "API_NUM", "YOUR_API_KEY", "PATH_TO_QUERY" )

##Splitting Video to Frames

(Note, usage of this requires ffmpeg to be installed. The best way to do this, if you're using OS X, is with Homebrew. See [brew.sh](http://brew.sh) for details on how to get it running and then run ```brew install ffmpeg```)

There is a script (```ffmpeg/split-video-to-frames.sh```) which uses ffmpeg to split a video into frames at a specified interval. This is to allow the recording of a session and its output as images.

Usage is as follows:

```sh ffmpeg/split-video-to-frames.sh path-to-input-file.mov 5 00:00:17 output-file-prefix```

This will take the file ```path-to-input-file.mov``` and output 5 frames every second, starting at 17 seconds from the beginning. The files will be named with ```output-file-prefix-000.png```, with ```-000``` incrementing with each file. 

The files will be placed in the same place as the script, make sure to move them before running it again, otherwise they'll be overwritten.

## TO DO
-[] add new sources
	-[] mechanical curator
	-[] prosthetic knowledge
-[] startup script
-[] fix wordcloud saving, delay until they are positioned

