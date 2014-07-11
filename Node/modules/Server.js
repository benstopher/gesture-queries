var http = require( 'http' );
var connect = require( 'connect' );

var app = connect();
console.log( __dirname + '/../public' );
app.use( connect.static( __dirname + '/../public' ) );

var Server = http.createServer( app );
Server.listen(8080);

console.log( 'Server now setup. Listening on :8080' );

module.exports = Server;