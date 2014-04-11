//see: http://stackoverflow.com/questions/4408535/node-connect-websockets

var connect = require( 'connect' );
var io = require( 'socket.io' );
var kinectOSC = require( './modules/Kinect.js' );


console.log( "Server starting, visit http://localhost:8080")

var server = connect.createServer(	
    connect.static( __dirname + '/public' )
).listen(8080);



var kinect = new kinectOSC( 12001, '127.0.0.1' );

var socket = io.listen(server);
var kinectSocket;
socket.of( '/kinect' ).on('connection', function(socket) {	
	socket.emit( "kinect-start" );
	kinectSocket = socket;
	
			
});

kinect.onFrameUpdate = function( data ){
	console.log( 'kinect data' );
	if( typeof kinectSocket !== 'undefined' ){
		kinectSocket.emit( "kinect-frame", data );
	}
}