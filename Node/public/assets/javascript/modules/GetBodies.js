GetBodies = function(){
	var that = this;
	this.frames = [];
	this.socket = io.connect( 'http://localhost/kinect' );
	this.socket.on('kinect-frame', function( data ){
		that._onResult( data );
	});
	this.socket.on('kinect-start', function(){
		that._onStart();
	});
};

GetBodies.prototype = {
	start: function(){
		var that = this;	

		this.socket
	},
	stop: function(){
		//
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
	},
};