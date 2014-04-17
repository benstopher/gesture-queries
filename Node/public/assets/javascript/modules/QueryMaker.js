var QueryMaker = function(){
	this.queries = [
		new Kimono( "68fnsfx2", "dcadb593109c905afe255fd53a5b7eb8", "q" ), //bldgblog.blogspot.com
		new Kimono( "aunznr34", "dcadb593109c905afe255fd53a5b7eb8", "s" ), //openculture.com
		new Kimono( "5r4qoam2", "dcadb593109c905afe255fd53a5b7eb8", "query" ), //creative review blog
	];
	this.results = [];
	this.results.length = this.queries.length;
};

QueryMaker.prototype = {
	query: function( value ){
		var that = this;
		var resultCount = 0;

		for( var i in this.queries ){
			(function( i ){
				that.queries[i].query( value, function( data, value ){
					resultCount++;
					that.results[ i ] = data.results.data;
					if( resultCount === that.queries.length - 1 ){
						that._onResult();
					}
				});
			})( i );
		}
	},
	onResult: function( data ){ /* override */ },
	_onResult: function(){	
		if( typeof this.onResult === 'function' ){
			this.onResult( this.results );
		}
	}
};