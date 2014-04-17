var isLog = 0;

GetHands = function(){
	var that = this;
	this.leap = new Leap.Controller({
		enableGestures: true,
		frameEventName: 'deviceFrame',
		loopWhileDisconnected: false
	});
	this.leap.on( 'connect', function(){
		that._onStart();
	});
	this.leap.on( 'frame', function( frame ){
		that._onResult( frame );
	});
	this.frames = [];
};

GetHands.prototype = {
	start: function(){
		this.leap.connect();
	},
	stop: function(){
		this.leap.disconnect();
	},
	onStart: function(){ /* override me */ },
	_onStart: function(){
		if( typeof this.onStart === 'function' )
			this.onStart();
	},
	onResult: function( frame ){ /* override me */ },
	_onResult: function( frame ){
		var data = this.parseFrame( frame );
		if( data ){
			this.frames.push( data );

			if( typeof this.onResult === 'function' )
				this.onResult( data );
		}
	},
	getAllStore: function(){
		return this.frames;
	},
	getNewStore: function(){
		var out = this.frames.slice( this.lastFramesGetPosition );
		if( out.length > 0 ){
			this.lastFramesGetPosition = this.frames.length;
			return out;
		}
		return false;
	},
	getLatestStore: function(){
		return this.frames[ this.frames.length - 1 ];
	},
	clearStore: function(){
		var out = getNewFrames();
		this.frames = [];
		return out;
	},
	parseHand: function( hand, timestamp ){
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
	},
	parseFrame: function( frame ){
		if( frame.hands.length < 1 ){
			return false;
		}
		var timestamp = (new Date()).getTime();
		var data = {
			timestamp: timestamp,
			hands: []
		};
		for( var i in frame.hands ){
			data.hands.push( this.parseHand( frame.hands[i], timestamp ) );
		}
		return data;
	}
};