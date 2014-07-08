var http = require( 'http' );
var connect = require( 'connect' );

var app = connect();
app.use( connect.static( __dirname + '/public' ) );

var Server = http.createServer( app );
Server.listen(8080);

console.log( 'Server now setup. Listening on :8080' );

module.exports = Server;