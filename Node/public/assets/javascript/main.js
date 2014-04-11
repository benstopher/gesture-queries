var ACCUMULATE = false;
var accumulate_btn = document.getElementById( 'btn-toggle-accumulate' );

var lineChart_hands = new LineChart( '#graph-line', window.innerWidth, window.innerHeight/2 );
var streamGraph_length = new StreamGraph( '#graph-stream', window.innerWidth, window.innerHeight/2 );

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
		if( typeof out[ body.userid ] === 'undefined' ){
			out[ body.userid ] = [];
		}

		var b = {
			time: body.timestamp,
			val: body.metrics.armSpan
		};

		out[ body.userid ].push( b );
	}
	return out;
};

var bodiesHeightToStreamGraph = function( bodiesArray ){
	var out = {};
	for( var i = 0; i < bodiesArray.length; i++ ){
		var body = bodiesArray[i];
		if( typeof out[ body.userid ] === 'undefined' ){
			out[ body.userid ] = []
		}
		var b = {
			time: body.timestamp,
			top: body.skeleton.head.y,
			bottom: (body.skeleton.leftFoot.y + body.skeleton.rightFoot.y) * 0.5
		};

		out[ body.userid ].push( b );

	}
	return out;
};
var bodiesHandsToStreamGraph = function( bodiesArray ){
	var out = {};
	for( var i = 0; i < bodiesArray.length; i++ ){
		var body = bodiesArray[i];
		if( typeof out[ body.userid ] === 'undefined' ){
			out[ body.userid ] = []
		}
		var b = {
			time: body.timestamp,
			top: body.skeleton.leftHand.x,
			bottom: body.skeleton.rightHand.x
		};

		out[ body.userid ].push( b );

	}
	return out;
};

var input = new Input( document.getElementById( 'output'), 1000 );
input.start();

input.saver.onSaveData = function( latest, all ){
	//if( ACCUMULATE ){
		var allBodies = [];
		
		for( var i = 0; i < all.length; i++ ){
			var thisOne = all[ i ];
			if( thisOne.bodies ){
				for( var j = 0; j < thisOne.bodies.data.length; j++ ){
					allBodies.push( thisOne.bodies.data[ j ] )
				}
			}
		}
	//}
	
	if( latest.bodies ){
		var data;
		if( ACCUMULATE ){
			data = bodiesHandsToLineChart( allBodies );
		} else {
			data = bodiesHandsToLineChart( latest.bodies.data );
		}

		lineChart_hands.addData( data );

		// if( ACCUMULATE ){
		// 	data = bodiesHeightToStreamGraph( allBodies );
		// } else {
		// 	data = bodiesHeightToStreamGraph( latest.bodies.data );
		// }
		//streamGraph_length.addData( data );

		//if( ACCUMULATE ){
			//data = bodiesHandsToStreamGraph( allBodies );
			data = bodiesHeightToStreamGraph( allBodies );
		//} else {
			//data = bodiesHandsToStreamGraph( latest.bodies.data );
		//}
		streamGraph_length.addData( data );
	}
}

accumulate_btn.addEventListener( 'click', function(){
	ACCUMULATE = !ACCUMULATE;
	if( ACCUMULATE ){
		input.saver.setUpdateInterval( 25 );
	} else {
		input.saver.setUpdateInterval( 1000 );
	}
});