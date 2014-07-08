var Timer = require( './Timer.js' );

var Analyse = function(){ 
	this.current = {};
	this.processed = {};
	this.previousTimestamp = 0;
};

Analyse.prototype = {
	addData: function( data_in ){
		this.previousTimestamp = this.current.timestamp;
		this.processed = this.analyse( data_in );
		this.current = data_in;
	},
	analyse: function( data_in ){
		return {
			timestamp: Timer.getUnixTimestamp(),
			hands: this.analyse_hands( data_in.hands ),
			bodies: this.analyse_bodies( data_in.bodies ),
			words: this.analyse_words( data_in.words ),
		};
	},
	analyse_hands: function( data_in ){
		var data_in = data_in || {};
		var freshData = true;
		try{			
			var previousHandsTimestamp = this.processed.hands.timestamp;
			console.log( 'HANDS TIMESTAMPS: ', previousHandsTimestamp, this.current.hands.timestamp );
			if( previousHandsTimestamp === data_in.timestamp ){
				freshData = false;
			}
		} catch( e ){ 
			console.log( e );
			freshData = false;
		}

		return {
			timestamp: data_in.timestamp,
			fresh: freshData,
			data: data_in
		};
	},
	analyse_bodies: function( data_in ){
		var data_in = data_in || {};
		var freshData = true;
		try{
			var previousBodiesTimestamp = this.current.bodies.timestamp;
			if( previousBodiesTimestamp === data_in.timestamp ){
				freshData = false;
			}			
		} catch( e ){ 
			console.log( e );
			freshData = false;
		}

		return {
			timestamp: data_in.timestamp,
			fresh: freshData,
			data: data_in
		};
	},
	analyse_words: function( data_in ){
		var data_in = data_in || {};
		var freshData = true;
		try{	
			var previousWordsTimestamp = this.current.words.timestamp;
			if( previousWordsTimestamp === data_in.timestamp ){
				freshData = false;
			}
		} catch( e ){ 
			console.log( e );
			freshData = false;
		}


		return {
			timestamp: data_in.timestamp,
			fresh: freshData,
			data: data_in
		};
	},
	getRecent: function(){
		return this.processed;
	}
};

module.exports = Analyse;