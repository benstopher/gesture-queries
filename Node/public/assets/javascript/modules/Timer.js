Timer = function(){	
	this.start();
};

Timer.prototype = {
	start: function(){
		this.date = new Date();
		this.startTime = this.date.getTime();
	},
	reset: function(){
		this.start();
	},
	getTimestamp: function(){
		return (new Date()).getTime() - this.startTime;
	},
	getUnixTimestamp: function(){
		return (new Date()).getTime();
	},
	getHumanDate: function(){
		var d = new Date();
		return d.getDate() + "/" + ( d.getMonth() + 1 ) + "/" + d.getFullYear();
	},
	getHumanTime: function(){
		var d = new Date();
		return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
	}
};