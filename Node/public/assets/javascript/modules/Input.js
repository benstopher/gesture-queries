Input = function( _ele ){
	this.ele = _ele;
	this.debug = false;
	this.speech = new GetSpeech();
	this.bodies = new GetBodies();
	this.hands = new GetHands();
	this.saver = new DataSaver(
		[
			{ 
				title: "bodies",
				source: this.bodies
			},
			{
				title: "words",
				source: this.speech
			},
			{
				title: "hands",
				source: this.hands,
			}
		],
		10000
	);
};

Input.prototype = {
	start: function(){
		var that = this;
		
		this.c = _o.createCanvas( window.innerWidth/2, window.innerHeight/2 );
		this.ele.appendChild( this.c.canvas );
		
		this.bodies.start();
		this.speech.start();
		this.hands.start();
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
		var bodies = this.bodies.getLatestStore();
		var speech = this.speech.getLatestStore();
		var hands = this.hands.getLatestStore();
		ctx.clearRect( 0, 0, cW, cH );
		ctx.fillStyle = "#000000";
		//render kinect info
		if( bodies ){
			var pJoint;
			for( var j in bodies.skeleton ){
				ctx.fillStyle = "#000000";
				var joint = new _o.vec( 
					_o.mapValue( bodies.skeleton[j].x, 0, 1, 0, cW ),
					_o.mapValue( bodies.skeleton[j].y, 0, 1, 0, cH ),
					_o.mapValue(bodies.skeleton[j].z, 0, 1, 25, 5 )
				);
				if( 
					(j === 'leftHand' && bodies.metrics.leftHandRaised) 
					|| (j === 'rightHand' && bodies.metrics.rightHandRaised) 
				){
					ctx.fillStyle = "#FF0000";
				}
				_o.render.fillCircle( ctx, joint.x, joint.y, joint.z );
									
				pJoint = new _o.vec();
				pJoint.copyFrom( joint );
			}
			ctx.fillStyle = "#FF0000";
			var height = _o.mapValue( bodies.metrics.height, 0, 1, 0, cH );
			ctx.fillRect( 0, cH - height, 30, cH );
			var x = _o.mapValue( bodies.skeleton.leftHand.x, 0, 1, 0, cW );
			var y = _o.mapValue( bodies.skeleton.leftHand.y, 0, 1, 0, cH );
			var w = _o.mapValue( bodies.metrics.armSpan, 0, 1, 0, cW );
			ctx.fillRect( x, y, w, 50 );

		}
		// render speech recognition words
		if( speech ){
			ctx.fillStyle = "#FF0000";
			ctx.font = "6em \'helvetica neue\'";
			ctx.textAlign = "center"; 
			ctx.textBaseline = "middle"; 
			ctx.fillText( speech, cW/2, cH/2 );
		}
		// render leap motion info
		if( hands ){
			console.log( hands );
		}

	},
	stop: function(){
		this.bodies.stop();
		this.speech.stop();
		this.hands.stop();
		this.saver.stop();
	},
	getData: function(){
		return this.saver.getData();
	},
	getLatestState: function(){
		return this.saver.getLatestState();
	}
};






