var StreamGraph = function( _ele, _w, _h ){
	this.eleString = _ele;
	this.ele = d3.select( this.eleString );
	this.margin = {top: 0, right: 0, bottom: 0, left: 0},
	this.width = _w - this.margin.left - this.margin.right;
	this.height = _h - this.margin.top - this.margin.bottom;

	this.numberLayers = 1;
	this.perLayer = 100;

	this.init();
};

StreamGraph.prototype = {
	stack: d3.layout.stack().offset("wiggle"),
	addLine: function( id ){
		var that = this;
		var c = "stream";
		if( id ){
			c += " stream-" + id;
		}
		this.numberLayers++;
		this.svg.append("path")
    		.attr("class", c )
    		.attr("d", this.area( [] ) )
    		.style( "fill", function() { return that.colour( help.colours.length % that.numberLayers ); });
	},
	init: function(){
		var that = this;

		this.colour = d3.scale.ordinal()
  			.range( help.colours );

    	this.x = d3.time.scale()
		    .range([0, this.width]);

		this.y = d3.scale.linear()
		    .range([this.height, 0]);
		
		this.area = d3.svg.area()
    		.x( function(d) { return that.x( d.time ); } )
    		.y0( function(d) { return that.y( d.top + d.bottom); } )
    		.y1( function(d) { return that.y( d.top	 ); } )
    		.interpolate( "basis" );

		this.svg = this.ele.append("svg")
		    .attr("width", this.width + this.margin.left + this.margin.right )
		    .attr("height", this.height + this.margin.top + this.margin.bottom )
		  .append("g")
    	    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    	this.addLine( 1 );

	},
	addData: function( data ){
		var that = this;
		this.numberLayers = 0;
		this.data = data;

		for( var i in data ){
			this.numberLayers++;
		}

		this.data = this.stack(d3.range( this.numberLayers ).map( function(){
			var arr = [];
			for( i in this.data ){
				arr.push( this.data[i] );
			}
			return arr;
		}));

		for( var id in data ){
			var idData = data[ id ];

			this.x.domain( d3.extent( idData, function(d) { return d.time; }) );
			this.y.domain( [ d3.max( idData, function(d) { return d.top + d.bottom; } ), 0 ] );

			if( this.svg.selectAll(".stream-" + id ).size() < 1 ){
				this.addLine( id );
			}

			this.svg.selectAll(".stream-" + id )
			    .datum( idData )
			    .transition()
			    .attr("d", this.area );

			// this.svg.selectAll(".line-" + id )
			//     .datum( idData ) // set the new data
			//     .transition()
	  //           .attr("d", this.line ); // apply the new data values
	    }
	},

};