
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
var bodiesHeightToLineChart = function( bodiesArray ){
	var out = {};
	for( var i = 0; i < bodiesArray.length; i++ ){
		var body = bodiesArray[i];
		if( typeof out[ body.id ] === 'undefined' ){
			out[ body.id ] = [];
		}
		var b = {
			time: body.timestamp,
			val: ((body.skeleton.leftFoot.y + body.skeleton.rightFoot.y) * 0.5) - body.skeleton.head.y
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

var handsOpenToDonutChart = function( handsArray ){
	var out = [ {value: 0}, {value:0} ];
	for( var i = 0; i < handsArray.length; i++ ){
	 	var hand = handsArray[ i ];
	 	if( hand.sphereRadius > 65 ){ //little bit of smoothing
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
		// for( var j = i; j < wordsArray.length; j++){
		// 	out.links.push( { source: i, target: j } );
		// }
	}

	return out;

}

var calculateAllBodies = function( all ){
	var allBodies = [];
	for( var i = 0; i < all.length; i++ ){
		var thisOne = all[ i ];
		if( thisOne.bodies ){
			for( var j = 0; j < thisOne.bodies.data.length; j++ ){
				allBodies.push( thisOne.bodies.data[ j ] );
			}
		}
	}
	return allBodies;
}

var calculateAllHands = function( all ){
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
	return allHands;
}