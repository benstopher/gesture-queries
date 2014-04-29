##Installation

- Install Processing (v2.0 or above)
- Install Simple OpenNI Processing library [instructions](https://code.google.com/p/simple-openni/wiki/Installation?ts=1377782923&updated=Installation)
- Install OSC P5 Processing Library [source](http://www.sojamo.de/libraries/oscP5/)
- Install Leap/Air Space [https://www.leapmotion.com/setup](https://www.leapmotion.com/setup)
- Install Google Chrome [source](http://www.google.com/chrome)
- Install node.js & npm [nodejs.org](http://nodejs.org/)
- download code
- cd into directory & run npm install



##Running

- Run Processing/oscKinectSend/oscKinectSend.pde
- Run node Node/main.js
- visit http://localhost:8080 in Chrome.


##Adjusting

###Query Sources

New, Kimono based query sources can be added easily. The file to edit is ```Node/public/assets/javascript/modules/QueryMaker.js```.

Beginning on line 2, there's a this.queries object that expects to have Kimono objects inside it. These should be configured like so:

new Kimono( "API_NUM", "YOUR_API_KEY", "PATH_TO_QUERY" )

