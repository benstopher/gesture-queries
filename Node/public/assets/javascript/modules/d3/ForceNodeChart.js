if( typeof require === 'function' ){
	var help = require( '../help.js' );
	var d3 = require( 'd3' );
}

var nodes = [];
var links = [];
var ForceNodeChart = function( _ele, _w, _h ){
	this.eleString = _ele;
	this.ele = ( this.eleString ) ? d3.select( this.eleString ) : d3.select('body').html('');
	this.margin = {top: 0, right: 0, bottom: 0, left: 0},
	this.width = _w - this.margin.left - this.margin.right;
	this.height = _h - this.margin.top - this.margin.bottom;
	this.adaptableY = true;
	this.interpolation = true;
	this.data = [];
	this.init();
};

ForceNodeChart.prototype = {
	init: function(){
		var that = this;
		this.nodes = [];
		this.links = [];
		this.colour = d3.scale.ordinal()
  			.range( help.colours );

		this.svg = this.ele.append("svg")
		    .attr("width", this.width + this.margin.left + this.margin.right )
		    .attr("height", this.height + this.margin.top + this.margin.bottom )
		  .append("g")
    	    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    	this.link = this.svg.selectAll(".link");
		this.node = this.svg.selectAll(".node");

		this.force = d3.layout.force()
		    .size([ this.width, this.height ])
		    .nodes( this.nodes )
    		.links( this.links )
		    .charge(-100)
		    .linkStrength( 0.2 )
		    .linkDistance(function( l, i ){
		    	return ((Math.sin(i) + (Math.random()*0.1)) * 150) + 100;
		    })
		    .on("tick", function(){
		    	that.tick()
		    });

		//this.force.nodes( this.centerNode );
		//console.log( this.force.nodes() );

	},
	tick: function(){
		var that = this; 
		if( this.link && this.node ){
			this.link.attr("x1", function(d) { return d.source.x; })
			  .attr("y1", function(d) { return d.source.y; })
			  .attr("x2", function(d) { return d.target.x ; })
			  .attr("y2", function(d) { return d.target.y; });

			// this.node.attr("cx", function(d) { return d.x; })
			//   .attr("cy", function(d) { return d.y; });
			this.node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		}
	},
	start: function() {
		var that = this;

		this.link = this.link.data( that.force.links(), function(d) { return d.source.id + "-" + d.target.id; });
		this.link.enter().insert("line", ".node").attr("class", "link").attr('stroke-width', '2' ).attr("stroke", "#FFFFFF");
		this.link.exit().remove();

		this.node = this.node.data( that.force.nodes(), function(d) { return d.id; });
		this.node.enter().append("g")
		  	.attr("class", "node")
      		.call( that.force.drag );
      	this.node.append("text")
      		.attr( "class", function(d){ return (d.center) ? "center" : "" })
      		.attr("x", 10 )
      		.attr("fill", "#ffffff" )
      		.attr("font-family", "'Executive'" )
      		.attr("font-size", "16")
      		.text(function(d) { return d.word.toUpperCase() });
      	this.node.append( "circle" )
      		.attr("cx", -3)
      		.attr("cy", -3)
      		.attr("r", 6)
      		.attr( "fill", "#FFFFFF" )
		this.node.exit().remove();

		this.link = this.svg.selectAll( ".link" );
		this.node = this.svg.selectAll( ".node" );

		this.force.start();
	},
	reset: function(){
		this.nodes = this.nodes.slice( -10 );
		this.links= this.links.slice( -10 );
	},
	addData: function( data ){
		var that = this;

		for( var i = 0; i < data.nodes.length; i++ ){
			data.nodes[i].x = data.nodes[i].x * this.width;
			data.nodes[i].y = data.nodes[i].y * this.height;
		}

		for( var i = 0; i < data.links.length; i++ ){
			data.links[i].source = data.links[i].source + this.nodes.length;
			data.links[i].target = data.links[i].target + this.nodes.length;
		}

		this.data = data;

		this.nodes = this.nodes.concat( data.nodes );
		this.links = this.links.concat( data.links );


		that.force.nodes( this.nodes );
		that.force.links( this.links );

		//var pCenter = this.force.nodes()[0];
		//var pNodes = this.force.nodes();
		// for( var i = 0; i < data.links.length; i++ ){
		// 	data.links[i].source = data.links[i].source + pNodes.length;
		// 	data.links[i].target = data.links[i].target + pNodes.length;
		// }
		// for( var i = 0; i < data.nodes.length; i++ ){
		// 	if( data.nodes[i].center === true ){
		// 		data.links.push({ source: pNodes.length, target: 0 })
		// 	}
		// 	pNodes.push( data.nodes[i] );
		// }
		
		// data.links.push({
		// 	source: 
		// })
		// this.force
		//   .nodes( pNodes )
		//   .links( data.links )


		// this.link.remove();
		//this.node.remove();
		


		// this.link = this.link.data( data.links )
		// 	.enter().append("line")
		//   	.attr("class", "link");

		// this.node = this.node.data( data.nodes) 
		// 	.enter().append("g")
		//   	.attr("class", "node")
  //     		.call( that.force.drag );

		// this.node.append("text")
  //     		.attr( "class", function(d){ return (d.center) ? "center" : "" })
  //     		.attr("x", 10 )
  //     		.text(function(d) { return d.word });

  //     	this.node.append( "circle" )
  //     		.attr("x", -3)
  //     		.attr("y", -3)
  //     		.attr("r", 6);
      	  

		this.start();

	},
	getData: function(){
		return this.ele.data();
	},
	addStylesInline: function( style ){
		this.ele.select( 'svg' ).insert( 'style', ':first-child' ).attr('type', 'text/css' ).html( style );
	}
};

if (typeof module === "object" && module.exports) module.exports = ForceNodeChart;