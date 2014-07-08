/*

1. collect input data
2. combine and analyse
3. output queries
4. receive query results
5. Render and save results

*/
var Server = require( './modules/Server.js' );
var Socket = require( './modules/Socket.js' );
var socket = new Socket( Server );


var module_input = require('./modules/Input.js');
var module_analyse = require('./modules/Analyse.js');

var input = new module_input( socket );
var analyse = new module_analyse();


var a = setInterval( function(){
	analyse.addData( input.out() );
	console.log( analyse.getRecent() );
}, 5000 );



