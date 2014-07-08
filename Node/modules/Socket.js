var io = require( 'socket.io' );

var Socket = function( server ){ // pass in a connect server
	this.socket = io.listen( server, { log: false } );
};

Socket.prototype = {

};

module.exports = Socket;