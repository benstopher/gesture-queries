if( typeof require === 'function' ){
	var help = require( '../help.js' );
	var d3 = require( 'd3' );
}

var DonutChart = function( _ele, _w, _h, _clr, _isAnimated){
	this.eleString = _ele;
	this.ele = ( this.eleString ) ? d3.select( this.eleString ) : d3.select('body').html('');
	this.margin = {top: 0, right: 0, bottom: 0, left: 0},
	this.width = _w - this.margin.left - this.margin.right;
	this.height = _h - this.margin.top - this.margin.bottom;
	this.radius = Math.min( this.width, this.height) / 2;
	this.numberLayers = 1;
	this.perLayer = 100;
	this.clr = _clr || help.piecolours[0];
	this.data = [];
	this.isAnimated = _isAnimated;
	this.init();
};

DonutChart.prototype = {
	pie: d3.layout.pie()
		.sort(null)
		.value(function(d) {
			return d.value;
		}),
	init: function(){
		var that = this;

  		this.colour = d3.scale.ordinal()
  			.range( this.clr );

		this.svg = this.ele.append("svg")
			.attr("width", this.width + this.margin.left + this.margin.right )
		    .attr("height", this.height + this.margin.top + this.margin.bottom )
	   
	    this.svg.append("rect")
    		.attr("x", 0)
    		.attr("y", 0)
    		.attr("width", this.width + this.margin.left + this.margin.right )
		    .attr("height", this.height + this.margin.top + this.margin.bottom )
		    .attr("fill", "#000000" );

		this.svg = this.svg.append("g")
			.attr( "transform", "translate(" + this.width/2 + "," + this.height/2 + ")" );

		this.svg.append( "g" ).attr( "class", "slices" );

		this.arc = d3.svg.arc()
			.outerRadius( this.radius * 0.8 )
			.innerRadius( this.radius * 0.4 );

		this.outerArc = d3.svg.arc()
			.innerRadius( this.radius * 0.9 )
			.outerRadius( this.radius * 0.9 );

	},
	addData: function( data ){
		var that = this;
		this.colour.domain( [ 0, data.length - 1] );
		this.data = this.pie( data );

		var slice = this.svg.select(".slices").selectAll("path.slice")
			.data( this.pie( data ) );

		slice.enter()
			.insert( "path" )
			.attr( "fill", function(d,i) { return that.colour( i ); })
			.attr( "class", "slice" );

		if( this.isAnimated ){
			slice		
				.transition().duration( 100 )
				.attrTween("d", function( d ) {
					this._current = this._current || d;
					var interpolate = d3.interpolate(this._current, d);
					this._current = interpolate( 0 );
					return function(t) {
						return that.arc( interpolate( t ) );
					};
				});
		} else {
			slice.attr( "d", function( d ){ return that.arc( d ) });
		}

		slice.exit()
			.remove();
	},
	getData: function(){
		return this.data;
	},
	getSVG: function(){
		return this.ele.html();
	},
	addStylesInline: function( style ){
		this.ele.select( 'svg' ).insert( 'style', ':first-child' ).attr('type', 'text/css' ).html( style );
	}
};

if (typeof module === "object" && module.exports) module.exports = DonutChart;