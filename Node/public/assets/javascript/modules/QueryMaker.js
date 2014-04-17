var QueryMaker = function( $ele ){
	this.$ele = $ele;
	this.$query = $ele.find('.query');
	this.$results = $ele.find('.results');
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
		this.updateTitle( value );

		for( var i in this.queries ){
			(function( i ){
				that.queries[i].query( value, function( data ){
					resultCount++;
					that.results[ i ] = data.results.data;
					if( resultCount === that.queries.length ){
						that._onResult();
					}
				});
			})( i );
		}
	},
	onResult: function( data ){ /* override */ },
	_onResult: function(){
		console.log( this.results );
		this.render( );
		
		if( typeof this.onResult === 'function' ){
			this.onResult( this.results );
		}
	},
	updateTitle: function( v ){
		this.$query.html( v );
	},
	render: function(){
		this.$results.empty()
		for( var i = 0; i < this.results.length; i++ ){
			var h = $( '<ul></ul>' );
			if( this.results[i] ){
				for( var j = 0; j < this.results[i].length; j++ ){
					var l = $('<li></li>' );
					var t = $( '<h1>' + this.results[ i ][ j ].title.text + '</h1>' );				
					//var a = $( '<a href="' + this.results[ i ][ j ].title.href + '">' + this.results[ i ][ j ].title.href + '</a>' );

					l.append( t );

					if( this.results[i][j].image.src != undefined ){
						var m = $( '<img src="' + this.results[ i ][ j ].image.src + '"/>' );
						l.append( m );
					}
					//l.append( a );
					
					
					h.append( l );

				}
			}
			this.$results.append( h );
		}
	}
};