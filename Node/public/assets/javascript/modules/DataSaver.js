var DataSaver = function( _sources, _storeInterval ){
	this.sources = _sources;
	this.storeInterval = _storeInterval || 1000;
	this.timer = new Timer();
	this.socket = io.connect( 'http://localhost/data' );
	this.socket.on('data-write-success', function( data ){
		console.log( 'saved file as', data );
	});
	this.data = {

	}
};

DataSaver.prototype = {
	onSaveData: function( latest, all ){ /* override me */ },
	_onSaveData: function( latest ){
		if( typeof this.onSaveData === 'function' ){
			this.onSaveData( latest, this.data.states );
		}
	},
	start: function(){
		var that = this;
		this.data.timestamp = this.timer.getUnixTimestamp();
		this.data.states = [];
		this.interval = setInterval( function(){
			that.save();
		}, this.storeInterval );
	},
	stop: function(){
		clearInterval( this.interval );
	},
	save: function(){
		var timestamp = this.timer.getTimestamp();
		var time = this.timer.getHumanTime();
		var date = this.timer.getHumanDate();
		var state = {
			timestamp: timestamp,
			time: time,
			date: date
		};
		var someNewData = false;
		for( var i in this.sources ){
			var source = this.sources[i].source;
			var destination = this.sources[i].destination;
			var data = source.getNewStore();
			if( data ){
				someNewData = true;
				state[ this.sources[i].title ] = { 
					timestamp: timestamp, 
					time: time,
					date: date,
					data: data 
				}
			}
		}
		if( someNewData ){
			this.data.states.push( state );
			this._onSaveData( state );
		}
	},
	saveToServer: function(){
		this.socket.emit( 'save-data', this.data );
	},
	setUpdateInterval: function( newInterval ){
		var that = this;
		this.storeInterval = newInterval;
		clearInterval( this.interval );
		this.interval = setInterval( function(){
			that.save();
		}, this.storeInterval );
	},
	setData: function( data ){
		this.data = data;
	},
	getData: function(){
		return this.data;
	},
	getLatestState: function(){
		return this.data.states[  this.data.states.length - 1 ];
	}
}