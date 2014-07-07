navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var SoundVsSilence = function( $ele, _w, _h, _thresh ){
	var that = this;
	this.threshold = _thresh;
	this.$ele = $ele;
	//this.c = _o.createCanvas( $ele.width(), $ele.height() );
	//this.$ele.append( this.c.canvas );
	this.width = _w;
	this.height = _h;
	this.chart = new DonutChart( this.$ele[0], this.width, this.height );
	this.data = [ {value: 0}, {value: 0} ];
	this.init();
}

SoundVsSilence.prototype = {
	init: function(){
		var that = this;
		navigator.getUserMedia( { audio: true }, function( stream ){
			that._onGotAudio( stream );
		}, function( error ){
			console.log( 'getUserMedia error: ', error );
		});
	},
	_onGotAudio: function( stream ){
		var that = this;
		this.aCtx = new AudioContext();
    	this.mediaStreamSource = this.aCtx.createMediaStreamSource( stream );
    	this.analyser = this.aCtx.createAnalyser();
    	this.mediaStreamSource.connect( this.analyser );
    	this.start();
	},
	start: function(){
		var that = this;
		this.interval = setInterval( function(){
			that.render();
		}, 50 );
	},
	render: function(){
		var data = new Uint8Array( this.analyser.frequencyBinCount );
		
		total = 0;
		this.analyser.getByteFrequencyData( data );
		
		for( var i = 0; i < data.length; i++ ){
			total += data[i];
		}
		
		total = total / data.length;

		if( total > 0.5 ){
			this.data[0].value++;
		} else {
			this.data[1].value++;
		}

		this.chart.addData( this.data );

	}
};