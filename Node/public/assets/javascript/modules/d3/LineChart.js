var LineChart = function( _ele, _w, _h ){
	this.eleString = _ele;
	this.ele = d3.select( this.eleString );
	this.margin = {top: 100, right: 100, bottom: 100, left: 100},
	this.width = _w - this.margin.left - this.margin.right;
	this.height = _h - this.margin.top - this.margin.bottom;

	this.init();
};

LineChart.prototype = {
	parseDate: function( d ){ 
		return d3.time.format("%d-%b-%y").parse( d ); 
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
		    .interpolate( "basis" )

		this.svg = this.ele.append("svg")
		    .attr("width", this.width + this.margin.left + this.margin.right )
		    .attr("height", this.height + this.margin.top + this.margin.bottom )
		  .append("g")
    	    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");	     	

    	this.svg.append("path")
    		.attr("class", "line")
    		.attr("d", this.line( [] ) );

	},
	addData: function( data ){
		var that = this;
		this.data = data;
		this.data.forEach(function(d) {
			d.time = d.time; //that.parseDate(d.date);
			d.val = +d.val;
		});

		this.x.domain(d3.extent(data, function(d) { return d.time; }));
		this.y.domain(d3.extent(data, function(d) { return d.val; }));

		this.svg.selectAll("path")
		    .datum( this.data ) // set the new data
		    .transition()
            .attr("d", this.line ); // apply the new data values
	},

};