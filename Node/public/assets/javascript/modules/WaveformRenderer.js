navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var WaveformRenderer = function( $ele, _w, _h ){
	var that = this;
	this.$ele = $ele;
	//this.c = _o.createCanvas( $ele.width(), $ele.height() );
	//this.$ele.append( this.c.canvas );
	this.width = _w;
	this.height = _h;
	this.chart = new LineChart( this.$ele[0], this.width, this.height );
	this.chart.setAdaptableY( false, 200, 55 );
	this.chart.setInterpolation( false );
	this.init();
}

WaveformRenderer.prototype = {
	init: function(){
		var that = this;
		navigator.getUserMedia( {audio:true}, function( stream ){
			that._onGotAudio( stream );
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
		var data = new Uint8Array( this.analyser.frequencyBinCount * 2);
		var chartFormatted = {};
		this.analyser.getByteTimeDomainData( data );
		chartFormatted[0] = [];
		for( var i = 0; i < data.length; i++ ){
			chartFormatted[0].push( { time: i, val: data[i] } );
		}
		this.chart.addData( chartFormatted );
	},
	getSoundSilenceProportion: function(){
		var data = new Uint8Array( this.analyser.frequencyBinCount );
		
	}
};