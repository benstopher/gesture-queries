//see: http://stackoverflow.com/questions/4408535/node-connect-websockets
var connect = require( 'connect' );
var io = require( 'socket.io' );
var kinectOSC = require( './modules/Kinect.js' );
var fs = require( 'fs' );
var d3 = require('d3');

var help = require( './public/assets/javascript/modules/help.js' );
var DonutChart = require( './public/assets/javascript/modules/d3/DonutChart.js');
var ForceNodeChart = require( './public/assets/javascript/modules/d3/ForceNodeChart.js');
var LineChart = require( './public/assets/javascript/modules/d3/LineChart.js');
var StreamGraph = require( './public/assets/javascript/modules/d3/StreamGraph.js');

var DATA = {};
var Twitter = ( function(){
	var t = require( './modules/Twitter.js' );
	return (new t());
})();
var savePath = '';
var dataSavePath = '';
var svgSavePath = '';
var pngSavePath = '';
var svgStyles = fs.readFileSync( __dirname + "/public/assets/stylesheets/svg-style.css", { encoding: 'utf8' } );

var SVG_HEADER = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

var makeTimestamp = function(){
	return new Date().getTime();
};

var setupSave = function( timestamp ){
	savePath = __dirname + "/data/" + timestamp + "/";
	fs.mkdir( __dirname + "/data/", function(){ 
		fs.mkdir( savePath, function(){
			dataSavePath = savePath + "data/";
			svgSavePath = savePath + "svg/";
			pngSavePath = savePath + "png/";
			fs.mkdir( dataSavePath, function(){
				console.log( "Save directory made: " + dataSavePath );
			});
			fs.mkdir( svgSavePath, function(){
				console.log( "Save directory made: " + svgSavePath );
			});
			fs.mkdir( pngSavePath, function(){
				console.log( "Save directory made: " + pngSavePath );
			})
		} );
	});
	
};
var chartSaveCounts = {};
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
	console.log( 'kinect connection' );
	socket.emit( "kinect-start" );
	kinectSocket = socket;		
});

kinect.onFrameUpdate = function( data ){
	if( typeof kinectSocket !== 'undefined' ){
		kinectSocket.emit( "kinect-frame", data );
	}
}

socket.of( '/twitter' ).on( 'connection', function(socket) {	
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
	console.log( 'save socket connection made. ' );
	socket.on( 'save-data', function( data ){
		var chart;
		var name = data.name;
		var colours = data.colours;
		chartSaveCounts[name] = ( typeof chartSaveCounts[name] !== 'undefined' ) ? chartSaveCounts[name] + 1 : 0;
		console.log( chartSaveCounts );

		if( data.type === 'base64' ){
			// 	console.log( 'save pixels as png' );
			//indebted to: http://stackoverflow.com/questions/20267939/nodejs-write-base64-image-file
			var matches = data.data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
			fs.writeFile( pngSavePath + name + "-" + chartSaveCounts[name] + ".png", new Buffer(matches[2], 'base64'), function( err ){
				console.log( "SAVED CHART (PNG)." );
			});
			return;
		} else if( data.type === 'svg' ){
			var svg = SVG_HEADER + data.data;
			fs.writeFile( svgSavePath + name + "-" + chartSaveCounts[name] + ".svg", svg, function( err ){
				console.log( "SAVED CHART (SVG)." );
			});
		}

		// fs.writeFile( dataSavePath + name + "-" + chartSaveCounts[name] + ".json", JSON.stringify( data.data ), function( err ){
		// 	console.log( "SAVED CHART (DATA)." );
		// });
	});
});

socket.of( '/save-words' ).on( 'connection', function( socket ){
	socket.on( 'save-data', function( data ){
		var svg = SVG_HEADER + data.svg;
		fs.writeFile( dataSavePath + "words-" + wordSaveCount + ".txt", data.words, {encoding: 'utf8'}, function( err ){
			console.log( "SAVED CHART (DATA)." );
		});
		fs.writeFile( svgSavePath + "words-" + wordSaveCount + ".svg", svg, function( err ){
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
			// send query information to the results page,
			// also send kinect arm-spread information for 
			// twitter location search
			queryDestSocket.emit( "query-data", {
				text: data,
				armSpread: kinect.latestFrame.metrics.armSpan
			});
		}
	});	
});

socket.of( '/control-panel' ).on('connection', function( socket ) {	
	socket.on( 'start-new-session', function( data ){
		timestamp = makeTimestamp();
	});	
});