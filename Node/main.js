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
var module_query = require('./modules/Query.js');

var input = new module_input( socket.socket );
var analyse = new module_analyse();

var interval = 5000;

var updateCount = 0;

var update = function(){
	console.log('update loop ' + updateCount );
	analyse.addData( input.out() );
	var recent = analyse.getRecent();
	console.log( "RECENT: ", recent );
	if( recent.fresh ){
		console.log( recent.hands.data );
		var query = new module_query( recent );
		query.send( function( results ){
			//do something with the results
			console.log( 'queried: ', results );
			setTimeout( update, interval );
		});
	} else {
		setTimeout( update, interval );
	}
	updateCount++;
};

update();


