var _o = require( './_o.utils.js' );
var config = require( '../config/general.js' );
var Kimono = require( './Kimono.js' );
var twitter_module = require( './Twitter.js' );
var twitter = new twitter_module();



var Query = function( data ){
	this.receivedKimono = false;
	this.receivedTwitter = false;
	
	this.queryByWord = false;
	this.queryByBody = false;
	this.queryByHand = false;

	this.wordQuery = '';
	this.locationQuery = {
		words: '',
		latitude: config.latitude,
		longitude: config.longitude,
		radius: '1mi'
	};
	if( data.words.fresh ){
		this.queryByWord = true;
		this.wordQuery = data.words.data;
	}
	if( data.bodies.fresh ){
		this.queryByBody = true;

		//this.locationQuery.radius = 
	}
	if( data.fresh && data.words.data ){
		this.queryByHand = true;
		console.log( "SEARCH RADIUS: ", _o.mapValue( data.hands.data.sphereRadius, 0, 100, 1, 1000 ) );
		this.locationQuery = {
			words: data.words.data,
			latitude: config.latitude,
			longitude: config.longitude,
			radius: _o.mapValue( data.hands.data.sphereRadius, 0, 100, 1, 1000 )
		};
		//this.locationQuery.radius = 
	}
};

Query.prototype = {
	send: function( callback ){
		if( !this.queryByWord && !this.queryByHand && !this.queryByBody ){
			if( typeof callback === 'function' ){
				callback( false );
			}
			return false;
		}
		var that = this;
		var results = {
			kimono: [],
			twitter: []
		};
		if( !this.queryByWord ){
			receivedKimono = true;
		} else {
			this.queryKimono( function( data ){
				results.kimono = data;
				receivedKimono = true;
				if( that.isComplete() && typeof callback === 'function' ){
					callback();
				}
			});
		}
		this.queryTwitter( function( data ){
			results.twitter = data;
			receivedTwitter = true;
			if( that.isComplete() && typeof callback === 'function' ){
				callback();
			}
		});
	},
	isComplete: function(){
		if( this.receivedTwitter && this.receivedKimono ){
			return true;
		}
		return false;
	},
	queryTwitter: function( callback ){
		var that = this;
		var resultAim = 3
		var resultCount = 0;
		var results = [];
		var isTwitterComplete = function(){
			if( resultCount === resultAim && typeof callback === 'function' ){
				callback( results );
			}
		};
		twitter.search( this.wordQuery, function( data ){
			console.log( 'twitterResult: ', data );
			results[0] = data;
			resultCount++;
			isTwitterComplete();
		});
		twitter.searchLocation( this.wordQuery, this.locationQuery.latitude, this.locationQuery.longitude, this.locationQuery.radius, function( data ){
			console.log( 'twitterResult: ', data );
			results[1] = data;
			resultCount++;
			isTwitterComplete();
		});
	},
	queryKimono: function( callback ){
		var that = this;
		var queries = [
			new Kimono( "68fnsfx2", "dcadb593109c905afe255fd53a5b7eb8", "q" ), //bldgblog.blogspot.com
			new Kimono( "8l9ah852", "dcadb593109c905afe255fd53a5b7eb8", "kimpath2" ), //v-e-n-u-e.com
			new Kimono( "aunznr34", "dcadb593109c905afe255fd53a5b7eb8", "s" ), //openculture.com
			new Kimono( "5r4qoam2", "dcadb593109c905afe255fd53a5b7eb8", "query" ), //creative review blog
			new Kimono( "6jmfrscq", "dcadb593109c905afe255fd53a5b7eb8", "input" ), //visual complexity
			new Kimono( "39ky2y6w", "dcadb593109c905afe255fd53a5b7eb8", "kimpath2" ), //popsci
			new Kimono( "52g6adto", "dcadb593109c905afe255fd53a5b7eb8", "kimpath2" ), //butdoesitfloat
			new Kimono( "5sfcl31k", "dcadb593109c905afe255fd53a5b7eb8", "s" ), //booooooom
			new Kimono( "3886gpy0", "dcadb593109c905afe255fd53a5b7eb8", "s" ), //brainpickings
			new Kimono( "5jh18v22", "dcadb593109c905afe255fd53a5b7eb8", "s" ), //MOMA design and violence
		];

		var resultCount = 0;
		var results = [];
		for( var i in queries ){
			(function( i ){
				queries[ i ].query( that.wordQuery, function( data, value ){
					resultCount++;
					results[ i ] = data.results;
					if( resultCount === queries.length - 1 && typeof callback === 'function' ){
						//console.log( 'kimonoresults: ', data );
						callback( results );
					}
				});
			})( i );
		}
	}
};

module.exports = Query;