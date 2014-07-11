var request = require( 'request' );
var kimono_credentials = require( '../config/kimono.js' );
var apiKey = kimono_credentials.api_key;

var Kimono = function( apiURL, queryParam ){
	var that = this;
	this.apiURL = apiURL;
	this.queryParam = queryParam;
	this.apiKey = apiKey;
	this.kimonoURL = "http://www.kimonolabs.com/api/"

	this.queryURL = this.constructURL();

}

Kimono.prototype = {
	init: function(){

	},
	constructURL: function(){
		var that = this;
		return this.kimonoURL + this.apiURL + "?apikey=" + this.apiKey + "&" + this.queryParam + "=";
	},
	query: function( value, callback ){
		var that = this;
		var valueArray = value.split( " " );
		value = "";
		for( var i = 0; i < valueArray.length; i++ ){
			if( i > 0 ){
				value += "+";
			}
			value += valueArray[ i ];
		}
		var url = this.queryURL + value;
		request( url, 
			function(err, response, body) {
  				response._original_query = value;
		    	if( typeof callback === 'function' ){
		    		callback( body );
		    	}
			}
		);
	},
	onResult: function( data ){ /* override me */ },
	_onResult: function( data ){
		if( typeof this.onResult === 'function' )
			this.onResult( data );
	}
}

module.exports = Kimono;