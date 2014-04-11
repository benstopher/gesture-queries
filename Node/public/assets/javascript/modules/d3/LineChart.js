var LineChart = function( _ele, _w, _h ){
	this.eleString = _ele;
	this.ele = d3.select( this.eleString );
	this.margin = {top: 100, right: 100, bottom: 100, left: 100},
	this.width = _w - this.margin.left - this.margin.right;
	this.height = _h - this.margin.top - this.margin.bottom;

	this.init();
};

LineChart.prototype = {
	addLine: function( id ){
		var c = "line ";
		if( id ){
			c += " line-" + id;
		}
		this.svg.append("path")
    		.attr("class", c )
    		.attr("d", this.line( [] ) );
	},
	init: function(){
		var that = this;
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
			this.y.domain(d3.extent( idData, function(d) { return d.val; }));

			if( this.svg.selectAll(".line-" + id ).size() < 1 ){
				this.addLine( id );
			}

			this.svg.selectAll(".line-" + id )
			    .datum( idData ) // set the new data
			    .transition()
	            .attr("d", this.line ); // apply the new data values
	    }
	},

};