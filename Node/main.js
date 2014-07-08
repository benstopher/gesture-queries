//see: http://stackoverflow.com/questions/4408535/node-connect-websockets
var connect = require( 'connect' );
var io = require( 'socket.io' );
var kinectOSC = require( './modules/Kinect.js' );
var fs = require( 'fs' );
var DATA = {};
var Twitter = ( function(){
	var t = require( './modules/Twitter.js' );
	return (new t());
})();
var savePath = '';
var dataSavePath = '';

var makeTimestamp = function(){
	return new Date().getTime();
};

var setupSave = function( timestamp ){
	savePath = __dirname + "/data/" + timestamp + "/";
	dataSavePath = savePath + "/data";
	fs.mkdir( __dirname + "/data/" + timestamp, function(){
		"DIRMADE"
	} );
};
var chartSaveCount = 0;
var wordSaveCount = 0;
var timestamp = makeTimestamp();

setupSave( timestamp );

console.log( "Server starting, visit http://localhost:8080" );

var server = connect.createServer(	
    connect.static( __dirname + '/public' )
).listen(8080);

var kinect = new kinectOSC( 12001, '127.0.0.1' );

var socket = io.listen(server,  { log: false });
var kinectSocket;

socket.of( '/kinect' ).on('connection', function(socket) {	
	socket.emit( "kinect-start" );
	kinectSocket = socket;		
});

kinect.onFrameUpdate = function( data ){
	if( typeof kinectSocket !== 'undefined' ){
		kinectSocket.emit( "kinect-frame", data );
	}
}

socket.of( '/twitter' ).on('connection', function(socket) {	
	socket.on( 'search', function( data ){
		Twitter.search( data.query, function( result ){
			socket.emit( 'result', result );
		});
	});
	socket.on( 'search-location', function( data ){
		Twitter.searchLocation( data.query, data.latitude, data.longitude, data.radius, function( result ){
			socket.emit( 'result', result );
		});
	});
	socket.on( 'user-timeline', function( data ){
		Twitter.userTimeline( data.query, function( result ){
			socket.emit( 'result', result );
		});
	});
});

socket.of( '/save-charts' ).on( 'connection', function( socket ){
	socket.on( 'save-data', function( data ){
		var svg = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + data;
		fs.writeFile( savePath + "chart-" + chartSaveCount + ".svg", svg, function( err ){
			console.log( "SAVED CHART." );
		});
		chartSaveCount++;
	});
});

socket.of( '/save-words' ).on( 'connection', function( socket ){
	socket.on( 'save-data', function( data ){
		var svg = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + data;
		fs.writeFile( savePath + "words-" + wordSaveCount + ".svg", svg, function( err ){
			console.log( "SAVED WORDS." );
		});
		wordSaveCount++;
	});
});

socket.of( '/data' ).on('connection', function( socket ) {	


	socket.emit( "data-ready" );
	socket.on( 'save-data', function( data ){
		DATA = data;
		fs.writeFile( dataSavePath, JSON.stringify( data, null, 4 ), function( err ){
			if( err ){
				socket.emit( "data-write-error" );
			} else {
				socket.emit( "data-write-success", fileName );
			}
		});
	});	
});

var query_data = {};
var queryDestSocket;

socket.of('/query-destination' ).on('connection', function( socket ){
	queryDestSocket = socket;
});

socket.of( '/query-source' ).on('connection', function( socket ) {	
	socket.on( 'data', function( data ){
		if( typeof queryDestSocket !== 'undefined' ){
			queryDestSocket.emit( "query-data", data );
		}
	});	
});

socket.of( '/control-panel' ).on('connection', function( socket ) {	
	socket.on( 'start-new-session', function( data ){
		timestamp = makeTimestamp();
	});	
});
