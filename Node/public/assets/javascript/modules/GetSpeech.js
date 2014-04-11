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
	onResult: function(){ /* override me */ },
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
			this.onResult();
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
	clearStore: function(){
		var out = getNewTranscript();
		this.transcript = '';
		return out;
	}
};