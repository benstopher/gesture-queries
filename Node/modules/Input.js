var kinectOSC = require( './Kinect.js' );
var Leap = require( 'leapjs' );
var Timer = require( './Timer.js' );

var processLeapData = function( data ){
	var timestamp = Timer.getUnixTimestamp();
	var parseHand = function( hand ){
		return {
			timestamp: timestamp,
			id: hand.id,
			sphereRadius: hand.sphereRadius,
			orientation: {
				pitch: hand.pitch(),
			    yaw: hand.yaw(),
			    roll: hand.roll()
			},
			metrics: {}
		}
	};
	var parseFrame = function( frame ){
		if( frame.hands.length < 1 ){
			return false;
		}
		// var timestamp = (new Date()).getTime();
		var data = {
			timestamp: timestamp,
			hands: []
		};
		for( var i in frame.hands ){
			data.hands.push( parseHand( frame.hands[i] ) );
		}
		return data;
	};

	return parseFrame( data );
};

var processSpeechData = function( words ){
	var timestamp = Timer.getUnixTimestamp();
	var data = {
		timestamp: timestamp,
		words: words
	};
	return  data;
}

var Input = function( socket ){
	var that = this;
	this.socket = socket;
	this.data = {
		hands: null,
		bodies: null,
		words: null
	};
	
	this.setupDevices();
	this.setupEvents();
};

Input.prototype = {
	setupDevices: function(){
		this.kinect = new kinectOSC( 12001, '127.0.0.1' );
		this.leap = new Leap.Controller({
			enableGestures: true,
			loopWhileDisconnected: false
		});		

		this.leap.connect();
	},
	setupEvents: function(){
		var that = this;
		this.kinect.onFrameUpdate = function( data ){
			that.data.bodies = data;
		}
		this.leap.on( 'frame', function( frame ){
			that.data.hands = processLeapData( frame );
		});
		this.socket.of( '/speech-recognition' ).on('connection', function( socket ){
			socket.on( 'data', function( data ){
				that.data.words = processSpeechData( data );
				console.log( that.data.words );
			});
		});
	},
	out: function(){
		return this.data;
	}
};

module.exports = Input;