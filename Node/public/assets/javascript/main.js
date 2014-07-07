var ACCUMULATE = true;
var accumulate_btn = document.getElementById( 'btn-toggle-accumulate' );
var setAccumulate = function(){
	if( ACCUMULATE ){
		input.saver.setUpdateInterval( 25 );
	} else {
		input.saver.setUpdateInterval( 1000 );
	}
};


var lineChart_hands = new LineChart( '#graph-line-span', window.innerWidth, window.innerHeight * 0.4 );
var streamGraph_length = new StreamGraph( '#graph-stream-length', window.innerWidth, window.innerHeight * 0.4 );
var streamGraph_sphereSize = new StreamGraph( '#graph-stream-sphere', window.innerWidth, window.innerHeight * 0.4 );
var donutChart_movement_not = new DonutChart( '#graph-donut-movement', window.innerWidth, window.innerHeight * 0.7 );
var forceNodeChart_words = new ForceNodeChart( '#graph-node-words', window.innerWidth, window.innerHeight * 0.7)

var removeZigfuWatermark = (function(){
	var removeWatermarkTimer = setInterval( function(){
		var findWatermark = $('a[href="http://zigfu.com/watermark"]').parents('div');				
		if( findWatermark.length !== 0 ){					
			$('a[href="http://zigfu.com/watermark"]').parents('div').remove();
			clearInterval( removeWatermarkTimer );
		}
	
	}, 50 );
})();

var bodiesHandsToLineChart = function( bodiesArray ){
	var out = {};
	for( var i = 0; i < bodiesArray.length; i++ ){
		var body = bodiesArray[i];
		if( typeof out[ body.id ] === 'undefined' ){
			out[ body.id ] = [];
		}

		var b = {
			time: body.timestamp,
			val: body.metrics.armSpan
		};

		out[ body.id ].push( b );
	}
	return out;
};

var bodiesHeightToStreamGraph = function( bodiesArray ){
	var out = {};
	for( var i = 0; i < bodiesArray.length; i++ ){
		var body = bodiesArray[i];
		if( typeof out[ body.id ] === 'undefined' ){
			out[ body.id ] = [];
		}
		var b = {
			time: body.timestamp,
			top: body.skeleton.head.y,
			bottom: (body.skeleton.leftFoot.y + body.skeleton.rightFoot.y) * 0.5
		};

		out[ body.id ].push( b );

	}
	return out;
};

var bodiesHandsToStreamGraph = function( bodiesArray ){
	var out = {};
	for( var i = 0; i < bodiesArray.length; i++ ){
		var body = bodiesArray[i];
		if( typeof out[ body.id ] === 'undefined' ){
			out[ body.id ] = [];
		}
		var b = {
			time: body.timestamp,
			top: body.skeleton.leftHand.x,
			bottom: body.skeleton.rightHand.x
		};

		out[ body.id ].push( b );

	}
	return out;
};

var handsSphereToStreamGraph = function( handsArray ){
	var out = {};
	for( var i = 0; i < handsArray.length; i++ ){
		var hand = handsArray[i];
		if( typeof out[ hand.id ] === 'undefined' ){
			out[ hand.id ] = [];
		}
		
		var h = {
			time: hand.timestamp,
			top: hand.sphereRadius,
			bottom: 50,
		}
		out[ hand.id ].push( h );

	}

	return out;
}

var bodiesMotionToDonutChart = function( bodiesArray ){
	 var out = [ {value: 0}, {value: 0} ];
	 for( var i = 0; i < bodiesArray.length; i++ ){
	 	var body = bodiesArray[ i ];
	 	if( body.metrics.motion > 0.01 ){ //little bit of smoothing
			out[0].value++;
		} else {
			out[1].value++;
		}
	 }
	 return out;
}

var nodeWordID = 0;
var wordsToNodeChart = function( words ){
	var out = {
		nodes: [],
		links: [],
		central: 0
	};
	var wordsArray = words.split(' ');
	out.central = Math.floor( wordsArray.length / 2 );

	for( var i = 0; i < wordsArray.length; i++ ){
		nodeWordID++;
		var node = {
			id: (i === out.central) ? 0 : nodeWordID,
			word: wordsArray[i],
			x: (i === out.central) ? 0.5 : Math.random(),
			y: (i === out.central) ? 0.5 : Math.random(),
			center: ( i === out.central )
		}	
		out.nodes.push( node );
		if( i !== out.central ){
			out.links.push( {source: i, target: out.central });
		}
	}

	return out;

}

var input = new Input( $('#output'), 100, true, true, true );
input.start();

setAccumulate();

var queryer = new QueryMaker( $( '#results' ) );
 
var updateResultInterval = 10000; //every 10 seconds
pQ = '';
setInterval( function(){
	var q = input.speech.getLastXStore( 3 );
	if( q.length > 0  && pQ !== q ){
		queryer.query( q );
		pQ = q;
	}
}, updateResultInterval );

var waveform = new WaveformRenderer( $('#graph-line-audio'), $('body').width(), 300 );


var wordChartAdditions = 0;
var updateWordChart = function(){

	if( wordChartAdditions > 10 ){
		forceNodeChart_words.reset();
		wordChartAdditions = 0;
	}

	var d = input.speech.getLastXStore( 25 );

	d = wordsToNodeChart( d );
	forceNodeChart_words.addData( d );
	wordChartAdditions++;
	setTimeout( function(){
		updateWordChart();
	}, 10000 );
}

updateWordChart();



input.saver.onSaveData = function( latest, all ){
	
	var allBodies = [];
	for( var i = 0; i < all.length; i++ ){
		var thisOne = all[ i ];
		if( thisOne.bodies ){
			for( var j = 0; j < thisOne.bodies.data.length; j++ ){
				allBodies.push( thisOne.bodies.data[ j ] );
			}
		}
	}

	var allHands = [];
	for( var i = 0; i < all.length; i++ ){
		var thisOne = all[i];
		if( thisOne.hands ){
			for( var j = 0; j < thisOne.hands.data.length; j++ ){
				for( var k = 0; k < thisOne.hands.data[ j ].hands.length; k++ ){
					allHands.push( thisOne.hands.data[ j ].hands[ k ] );
				}
			}
		}
	}

	if( latest.bodies ){
		var data;
		if( ACCUMULATE ){
			lineChart_hands.addData( bodiesHandsToLineChart( allBodies ) );
		} else {
			lineChart_hands.addData( bodiesHandsToLineChart( latest.bodies.data ) );
		}

		streamGraph_length.addData( bodiesHeightToStreamGraph( allBodies) );
		donutChart_movement_not.addData( bodiesMotionToDonutChart( allBodies ) );

	}
	if( latest.hands ){
		streamGraph_sphereSize.addData( handsSphereToStreamGraph( allHands ) );
	}
}

accumulate_btn.addEventListener( 'click', function(){
	ACCUMULATE = !ACCUMULATE;
	setAccumulate();
});