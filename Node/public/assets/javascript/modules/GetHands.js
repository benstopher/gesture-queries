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
	onResult: function(){ /* override me */ },
	_onResult: function( frame ){		
		this.frames.push( frame );

		if( typeof this.onResult === 'function' )
			this.onResult( frame );
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
	}
};