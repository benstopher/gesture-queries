Output = function( _ele ){
	this.ele = _ele;	
};

Output.prototype = {
	start: function(){
		var that = this;
		this.c = _o.createCanvas();
		this.ele.append( this.c.canvas );
		_o.draw = function(){
			that.render();
		};
		_o.loop();
	},
	stop: function(){
		
	}
};