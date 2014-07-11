GetSpeech = function(){
	var that = this;
	this.recognition = new webkitSpeechRecognition();
	this.recognition.continuous = true;
	this.recognition.interimResults = true;
	this.transcript = '';
	this.interim_transcript = '';
	this.lastTranscriptGetLength = 0;
	this.recognition.onstart = function(){
		that._onStart();
	};
	this.recognition.onresult = function(){
		that._onResult();
	};
};

GetSpeech.prototype = {
	start: function(){
		this.recognition.start();
	},
	stop: function(){
		this.recognition.stop();
	},
	onStart: function(){ /* override me */ },
	_onStart: function(){

		if( typeof this.onStart === 'function' )
			this.onStart();
	},
	onResult: function( data ){ /* override me */ },
	_onResult: function(){
		this.interim_transcript = '';

	    for (var i = event.resultIndex; i < event.results.length; ++i) {
			if( event.results[i].isFinal ){
				this.transcript += event.results[i][0].transcript;
			} else {
				this.interim_transcript += event.results[i][0].transcript;
			}
	    }
	    
		if( typeof this.onResult === 'function' )
			this.onResult( this.transcript );
	},
	getAllStore: function(){
		return this.transcript;
	},
	getNewStore: function(){
		var out = this.transcript.substring( this.lastTranscriptGetLength );
		if( out.length > 0 ){
			this.lastTranscriptGetLength = this.transcript.length;
			return out;
		}
		return false;
	},
	getLatestStore: function(){
		var words = this.transcript.split( ' ' );
		return words[ words.length - 1 ];
	},
	getLastXStore: function( count ){
		var words = this.transcript.split( ' ' );
		var out = '';
		var start = words.length - count - 1;
		if( start < 0 ){
			start = 0;
		}
		for( var i = start; i < words.length; i++ ){
			if( i > start ){
				out+= ' '; 
			}
			out += words[ i ];
		}
		return out;
	},	
	clearStore: function(){
		var out = getNewTranscript();
		this.transcript = '';
		return out;
	}
};