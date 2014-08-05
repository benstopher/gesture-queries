var LineChart = function( _ele, _w, _h ){
	this.eleString = _ele;
	this.ele = d3.select( this.eleString );
	this.margin = {top: 0, right: 0, bottom: 0, left: 0},
	this.width = _w - this.margin.left - this.margin.right;
	this.height = _h - this.margin.top - this.margin.bottom;
	this.adaptableY = true;
	this.interpolation = true;
	this.data = [];
	this.init();
};

LineChart.prototype = {
	addLine: function( id ){
		var that = this;
		var c = "line ";
		if( id ){
			c += " line-" + id;
		}
		this.svg.append("path")
    		.attr("class", c )
    		.attr("d", this.line( [] ) )
    		.style( "stroke", function(d,i) {  return that.colour( id || 0  ); });
	},
	init: function(){
		var that = this;

		this.colour = d3.scale.ordinal()
  			.range( help.linecolours );

		this.x = d3.time.scale()
		    .range([0, this.width]);

		this.y = d3.scale.linear()
		    .range([this.height, 0]);

		this.xAxis = d3.svg.axis()
		    .scale(this.x)
		    .orient("bottom");

		this.yAxis = d3.svg.axis()
		    .scale(this.y)
		    .orient("left");

		this.line = d3.svg.line()
		    .x(function(d) { return that.x(d.time); })
		    .y(function(d) { return that.y(d.val); })
		    .interpolate( "basis" );

		this.svg = this.ele.append("svg")
		    .attr("width", this.width + this.margin.left + this.margin.right )
		    .attr("height", this.height + this.margin.top + this.margin.bottom )
		  .append("g")
    	    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");	     	

    	this.addLine( 1 );

	},
	setInterpolation: function( to ){
		var that = this;
		this.interpolate = to;
		if( to ){
			this.line = d3.svg.line()
		   	 	.x(function(d) { return that.x(d.time); })
		    	.y(function(d) { return that.y(d.val); })
		    	.interpolate( "basis" );
		} else {
			this.line = d3.svg.line()
		    .x(function(d) { return that.x(d.time); })
		    .y(function(d) { return that.y(d.val); })
		    .interpolate( false );
		}
	},
	setAdaptableY: function( to, _min, _max ){
		this.adaptableY = to;
		if( !to ){
			this.y.domain( [_min, _max] );
		}
	},
	addData: function( data ){
		var that = this;
		this.data = data;
		for( var id in data ){
			var idData = data[ id ];
			idData.forEach(function(d) {
				d.time = d.time; //that.parseDate(d.date);
				d.val = +d.val;
			});

			this.x.domain(d3.extent( idData, function(d) { return d.time; }));
			if( this.adaptableY ){
				this.y.domain(d3.extent( idData, function(d) { return d.val; }));
			}

			if( this.svg.selectAll(".line-" + id ).size() < 1 ){
				this.addLine( id );
			}
			if( this.interpolate ){
				this.svg.selectAll(".line-" + id )
				    .datum( idData ) // set the new data
				    .transition()
		            .attr("d", this.line ); // apply the new data values
		    } else {
		    		this.svg.selectAll(".line-" + id )
				    .datum( idData ) // set the new data
		            .attr("d", this.line ); // apply the new data values
		    }
	    }
	},
	getData: function(){
		return this.data;
	}

};