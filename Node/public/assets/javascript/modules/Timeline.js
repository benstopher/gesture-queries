VisualiseTimeline = function( _session, _$ele ){
	this.session = _session;
	this.$ele = _$ele;
	this.fetchData();
}

VisualiseTimeline.prototype = {
	getDuration: function(){
		var last = this.states[ this.states.length - 1];
		if( typeof last !== 'undefined' ){
			return last.timestamp;
		}
		return false;
	},
	fetchData: function(){
		var that = this;
		this.states = [];
		if( typeof this.session !== 'undefined' ){
			for( var i = 0; i < this.session.states.length; i++ ){
				var rawState = Collections.States.findOne( { _id: this.session.states[i] });
				if( typeof rawState !== 'undefined' ){
					( function( s ){
						console.log( s.bodies );
						var state = {
							timestamp: s.timestamp,
							time: s.time,
							date: s.date, 
							words: Collections.Words.findOne( { _id: s.words }),
							hands: Collections.Hands.findOne( { _id: s.hands }),
							bodies: Collections.Bodies.findOne( { _id: s.bodies })
						};
						console.log( state );
						that.states.push( state );
					})( rawState );
				}
			}
			this.duration = this.getDuration();
		}
	},
	render: function(){
		for( var i = 0; i < this.states.length; i++ ){
			//console.log( this.states[i] );			
		}
	}
}