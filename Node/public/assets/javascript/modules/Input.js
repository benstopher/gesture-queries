Input = function( _$ele, _saveInterval, _setSpeech, _setBodies, _setHands ){
	this.$ele = _$ele;
	this.debug = false;
	this.setSpeech = _setSpeech || false;
	this.setBodies = _setBodies || false;
	this.setHands = _setHands || false;
	var saverSources = [];
	if( this.setSpeech ){
		this.speech = new GetSpeech();
		saverSources.push({
			title: "words",
			source: this.speech
		});
	}
	if( this.setBodies ){
		this.bodies = new GetBodies();
		saverSources.push({
			title: "bodies",
			source: this.bodies
		});
	}
	if( this.setHands ){
		this.hands = new GetHands();
		saverSources.push({
			title: "hands",
			source: this.hands
		});
	}
	this.saver = new DataSaver(
		saverSources,
		_saveInterval
	);
};

Input.prototype = {
	start: function(){
		var that = this;

		this.c = _o.createCanvas( this.$ele.width(), this.$ele.width() );
		this.$ele.append( this.c.canvas );
		
		if( this.setBodies ){
			this.bodies.start();
		}
		if( this.setSpeech ){
			this.speech.start();
		}
		if( this.setHands ){
			this.hands.start();
		}
		this.saver.start();
	},
	debugMode: function( to ){
		var that = this;
		this.debug = to;
		if( to === true ){
			_o.draw = function(){
				that.debugRender();
			};
			_o.loop();
		} else {
			_o.draw = function(){};
			_o.unLoop();
		}
	},
	debugRender: function(){
		var ctx = this.c.ctx;
		var cW = this.c.w;
		var cH = this.c.h;
		if( this.setBodies ){
			var bodies = this.bodies.getLatestStore();
		}
		if( this.setSpeech ){
			var speech = this.speech.getLatestStore();
		}
		if( this.setHands ){
			var hands = this.hands.getLatestStore();
		}
		ctx.clearRect( 0, 0, cW, cH );
		ctx.fillStyle = "#FFFFFF";
		//render kinect info
		if( bodies && this.setBodies ){
			var pJoint;
			for( var j in bodies.skeleton ){
				ctx.fillStyle = "#FFFFFF";
				var joint = new _o.vec( 
					_o.mapValue( bodies.skeleton[j].x, 0, 1, 0, cW ),
					_o.mapValue( bodies.skeleton[j].y, 0, 1, 0, cH ),
					_o.mapValue(bodies.skeleton[j].z, 0, 1, 10, 5 )
				);
				if( 
					(j === 'leftHand' && bodies.metrics.leftHandRaised) 
					|| (j === 'rightHand' && bodies.metrics.rightHandRaised) 
				){
					ctx.fillStyle = "#F6742C";
				}
				_o.render.fillCircle( ctx, joint.x, joint.y, 3 );
									
				pJoint = new _o.vec();
				pJoint.copyFrom( joint );
			}

			ctx.fillStyle = "#F6742C";
			var height = _o.mapValue( bodies.metrics.height, 0, 1, 0, cH );
			ctx.fillRect( cW - 10, cH - height, cW, cH );
			var x = _o.mapValue( bodies.skeleton.leftHand.x, 0, 1, 0, cW );
			var y = _o.mapValue( bodies.skeleton.leftHand.y, 0, 1, 0, cH );
			var w = _o.mapValue( bodies.metrics.armSpan, 0, 1, 0, cW );
			ctx.fillStyle = "#F6742C";
			ctx.fillRect( x, y, w, 10 );

		}
		// render speech recognition words
		if( speech && this.setSpeech ){
			ctx.fillStyle = "#FF0000";
			ctx.font = "6em \'helvetica neue\'";
			ctx.textAlign = "center"; 
			ctx.textBaseline = "middle"; 
			ctx.fillText( speech, cW/2, cH/2 );
		}
	},
	stop: function(){
		if( this.setBodies ){
			this.bodies.stop();
		}
		if( this.setSpeech ){
			this.speech.stop();
		}
		if( this.setHands ){
			this.hands.stop();
		}
		this.saver.stop();
	},
	getData: function(){
		return this.saver.getData();
	},
	getLatestState: function(){
		return this.saver.getLatestState();
	}, 
	getDebugPixelsAsBase64: function(){
		return this.c.canvas.toDataURL();
	}
};