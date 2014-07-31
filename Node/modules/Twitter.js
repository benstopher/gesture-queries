var OAuth = require( 'oauth' );
var credentials = require( '../config/twitter.js' );

var Twitter = function(){
	this.oauth = new OAuth.OAuth(
		'https://api.twitter.com/oauth2/token',
		'https://api.twitter.com/oauth/access_token',
		credentials.application.key,
		credentials.application.secret,
		'1.0A',
		null,
		'HMAC-SHA1'
    );
};

Twitter.prototype = {
	wrapResult: function( type, result, count ){
		var wrapped = {
			type: type,
			data: {}
		};
		if( result ){
			var i = 0;
			var data = JSON.parse(result);
			var retweets_excluded = [];
			for( var i = 0; i < data.statuses.length; i++ ){
				if( !data.statuses[i].retweeted_status ){
					retweets_excluded.push( data.statuses[i] );
				}
				if( retweets_excluded >= count ){
					break;
				}
			}
			data.statuses = retweets_excluded;
			wrapped.data = data;
		}
		return wrapped;
	},
	search: function( what, callback ){
		var that = this;
		this.oauth.get(
			'https://api.twitter.com/1.1/search/tweets.json?count=50&q=' + encodeURIComponent( what ),
			credentials.user.key,
			credentials.user.secret,     
			function(error, data, res){
				if(error){
					console.error("ERROR: ", error); 
				}
				var result = that.wrapResult( 'search', data, 20 );
				that._onResult( result );
				if( typeof callback === 'function' ){
					callback( result );
				}
			}
		);
	},
	searchLocation: function( what, lat, lon, radius, callback ){
		var that = this;
		this.oauth.get(
			'https://api.twitter.com/1.1/search/tweets.json?count=50&q=' + encodeURIComponent( what ) + '&geocode=' + lat + ',' + lon + ',' + radius,
			credentials.user.key,
			credentials.user.secret,     
			function(error, data, res){
				if(error){
					console.error("ERROR: ", error); 
				}
				var result = that.wrapResult( 'search-location', data, 20 );
				that._onResult( result );
				if( typeof callback === 'function' ){
					callback( result );
				}
			}
		);
	},
	userTimeline: function( who, callback ){
		var that = this;
		this.oauth.get(
			'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=' + who,
			credentials.user.key,
			credentials.user.secret,     
			function(error, data, res){
				if(error){
					console.error( "ERROR: ", error ); 
				}
				var result = that.wrapResult( 'user-timeline', data, 25 );
				that._onResult( result );
				if( typeof callback === 'function' ){
					callback( result );
				}
			}
		);
	},
	onResult: function( data ){
		/* ... override ... */
	},
	_onResult:  function( data ){
		if( typeof this.onResult === 'function' ){
			this.onResult( data );
		}
	}
};

module.exports = Twitter;