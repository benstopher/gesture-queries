var Twitter = require( './modules/Twitter.js');

var t = new Twitter();
t.onResult = function( data ){
	console.log( 'result: ', data );
}
t.search( 'something' );