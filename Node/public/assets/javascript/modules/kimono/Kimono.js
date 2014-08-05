var Kimono = function( apiURL, apiKey, queryParam ){
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
	query: function( value, success, failure ){
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
		console.log( "ajax to: " + url );
		$.ajax({
		    "url": url,
		    "crossDomain":true,
		    "dataType":"jsonp",
		    "success": function( data ){
		    	data._original_query = value;
		    	if( typeof success === 'function' ){
		    		success( data );
		    	}

		    	that._onResult( data );
		    },
		    error: function( xhr, type ){
		    	if( typeof failure === 'function' ){
		    		failure( type );
		    	}
		    }
		});

	},
	onResult: function( data ){ /* override me */ },
	_onResult: function( data ){
		if( typeof this.onResult === 'function' )
			this.onResult( data );
	}
}