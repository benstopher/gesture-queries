var parseButDoesItfloat = function( data ){
	for( var i = 0; i < data.length; i++ ){
		data[i].image.src = data[i].image.original;
	}
	return data;
};

var QueryMaker = function(){
	this.queries = [
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
		new Kimono( "86n063ww", "dcadb593109c905afe255fd53a5b7eb8", "s" ), //inverted audio
	];
	this.results = [];
	this.results.length = this.queries.length;
};

QueryMaker.prototype = {
	query: function( value ){
		var that = this;
		var resultCount = 0;
		// clear previous results
		this.results = [];

		for( var i in this.queries ){
			(function( i ){
				that.queries[i].query( 
					value, 
					function( data, value ){
						if( that.queries[i].apiURL === '52g6adto' ){
							//is 'but does it float' - need to wrangle some data
							data.results.data = parseButDoesItfloat( data.results.data );
						}
						resultCount++;
						that.results.push( data.results.data );
						that._onEachResult( data.results.data );
						if( resultCount === that.queries.length - 1 ){
							that._onResult();
						}
					}, function(){
						resultCount++;
						if( resultCount === that.queries.length - 1 ){
							that._onResult();
						}
					}
				);
			})( i );
		}
	},
	onEachResult: function( data ){ /* override */ },
	_onEachResult: function( data ){
		if( typeof this.onEachResult === 'function' ){
			this.onEachResult( data );
		}
	},
	onResult: function( data ){ /* override */ },
	_onResult: function(){	
		if( typeof this.onResult === 'function' ){
			this.onResult( this.results );
		}
	}
};