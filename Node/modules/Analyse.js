/*
takes data from the input, checks if it's fresh (currently, should do more) and then outputs it for the query maker
{ 
	fresh: [boolean],
	timestamp: [number/unixtime],
	hands: [object],
	bodies: [object],
	words: [object] 
}
*/

var Timer = require( './Timer.js' );

var Analyse = function(){ 
	this.current = {};
	this.processed = { 
		fresh: false,
		timestamp: 0,
		hands: {},
		bodies: {},
		words: {} 
	};
	this.previousTimestamp = 0;
};

Analyse.prototype = {
	addData: function( data_in ){
		this.previousTimestamp = this.current.timestamp;
		this.processed = this.analyse( data_in );
	},
	analyse: function( data_in ){
		var timestamp = Timer.getUnixTimestamp();
		var hands = this.analyse_hands( data_in.hands );
		var bodies = this.analyse_bodies( data_in.bodies );
		var words = this.analyse_words( data_in.words );
		var fresh = false;
		console.log( 'ANALYSE' );
		console.log( 'Words are fresh? ', words.fresh );
		if( hands.fresh || bodies.fresh || words.fresh ){
			fresh = true;
		}

		var newData = {
			fresh: fresh,
			timestamp: timestamp,
			hands: (hands.fresh) ? hands : this.processed.hands,
			bodies: (bodies.fresh) ? bodies : this.processed.bodies,
			words: (words.fresh) ? words : this.processed.words
		};

		return newData;
	},
	analyse_hands: function( data_in ){
		var data_in = data_in || {};
		var freshData = true;
		console.log( 'analyse hands', data_in.timestamp );
		try{			
			var previousHandsTimestamp = this.processed.hands.timestamp;
			if( previousHandsTimestamp === data_in.timestamp ){
				freshData = false;
			}
		} catch( e ){ 
			console.log( 'hands error: ', e );
			freshData = false;
		}
		data_in.fresh = freshData;
		return data_in;
	},
	analyse_bodies: function( data_in ){
		var data_in = data_in || {};
		var freshData = true;
		try{
			var previousBodiesTimestamp = this.processed.bodies.timestamp;
			if( previousBodiesTimestamp === data_in.timestamp ){
				freshData = false;
			}			
		} catch( e ){ 
			//console.log( e );
			freshData = false;
		}
		data_in.fresh = freshData;
		return data_in;
	},
	analyse_words: function( data_in ){
		var data_in = data_in || {};
		var freshData = true;
		try{	
			var previousWordsTimestamp = this.processed.words.timestamp;
			if( previousWordsTimestamp === data_in.timestamp ){
				freshData = false;
			}
		} catch( e ){ 
			//console.log( e );
			freshData = false;
		}
		data_in.fresh = freshData;
		return data_in;
	},
	getRecent: function(){
		return this.processed;
	}
};

module.exports = Analyse;