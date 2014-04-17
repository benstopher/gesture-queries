var DonutChart = function( _ele, _w, _h, _clr ){
	this.eleString = _ele;
	this.ele = d3.select( this.eleString );
	this.margin = {top: 0, right: 0, bottom: 0, left: 0},
	this.width = _w - this.margin.left - this.margin.right;
	this.height = _h - this.margin.top - this.margin.bottom;
	this.radius = Math.min( this.width, this.height) / 2;
	this.numberLayers = 1;
	this.perLayer = 100;
	this.clr = _clr || help.piecolours[0];

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

		// this.colour = d3.scale.linear()
  //   		.range(["#ff0000", "#ff00ff"]);

  		//this.colour = d3.scale.category20();
  		this.colour = d3.scale.ordinal()
  			.range( this.clr );
  		//console.log( this.colour.domain() );

		this.svg = this.ele.append("svg")
			.attr("width", this.width + this.margin.left + this.margin.right )
		    .attr("height", this.height + this.margin.top + this.margin.bottom )
		  .append("g");

		this.svg.attr( "transform", "translate(" + this.width/2 + "," + this.height/2 + ")" );

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

		var slice = this.svg.select(".slices").selectAll("path.slice")
			.data( this.pie( data ) );

		slice.enter()
			.insert( "path" )
			.style( "fill", function(d,i) { return that.colour( i ); })
			.attr( "class", "slice" );

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

		slice.exit()
			.remove();

	}
};