var Twitter = function(){
	var that = this;
	this.socket = io.connect( 'http://localhost/twitter' );
	console.log( "CONNECT TO http://localhost/twitter" );
	this.socket.on('result', function( data ){
		that._onResult( data );
	});
};

Twitter.prototype = {
	search: function( query ){
		var data = {
			query: query
		}
		this.socket.emit( 'search', data );
	},
	searchLocation: function( query, latitude, longitude, radius ){
		var data = {
			query: query,
			latitude: latitude,
			longitude: longitude,
			radius: radius
		};
		this.socket.emit( 'search-location', data );
	},
	userTimeline: function( who ){
		var data = {
			query: who
		};
		this.socket.emit( 'user-timeline', data );
	},
	onResult: function( data ){ /* override me */ },
	_onResult: function( data ){
		if( typeof this.onResult === 'function' )
			this.onResult( data );
	}
};