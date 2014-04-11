var ACCUMULATE = false;
var accumulate_btn = document.getElementById( 'btn-toggle-accumulate' );

var lineChart_hands = new LineChart( '#graph-line', window.innerWidth, window.innerHeight );

var removeZigfuWatermark = (function(){
	var removeWatermarkTimer = setInterval( function(){
		var findWatermark = $('a[href="http://zigfu.com/watermark"]').parents('div');				
		if( findWatermark.length !== 0 ){					
			$('a[href="http://zigfu.com/watermark"]').parents('div').remove();
			clearInterval( removeWatermarkTimer );
		}
	
	}, 50 );
})();

var bodiesToLineChart = function( bodiesArray ){
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
}

var input = new Input( document.getElementById( 'output'), 10 );
input.start();

input.saver.onSaveData = function( latest, all ){
	if( ACCUMULATE ){
		var allBodies = [];
		
		for( var i = 0; i < all.length; i++ ){
			var thisOne = all[ i ];
			if( thisOne.bodies ){
				for( var j = 0; j < thisOne.bodies.data.length; j++ ){
					allBodies.push( thisOne.bodies.data[ j ] )
				}
			}
		}
	}
	
	if( latest.bodies ){
		var data;
		if( ACCUMULATE ){
			data = bodiesToLineChart( allBodies );
		} else {
			data = bodiesToLineChart( latest.bodies.data );
		}

		lineChart_hands.addData( data );
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