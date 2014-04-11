var osc = require( 'node-osc' );
var _o = require( './_o.utils.js' );

var Kinect = function( _port, _ip ){
	this.oscPort = _port;
	this.oscIP = _ip;
	this.osc = new osc.Server( this.oscPort, this.oscIP );
	this.users = {};
	this.listen();
};

Kinect.prototype = {
	listen: function(){
		var that = this;
		this.osc.on( "message", function( msg, rinfo ){
			console.log( 'kinect sent message ' );
			if( msg[0].indexOf( "/userfound" ) !== -1 ){
				that.addUser( msg[1] );
			}
			if( msg[0].indexOf( "/userlost" ) !== -1 ){
				that.removeUser( msg[1] );
			}
			if( msg[0].indexOf( "/user/" ) !== -1 ){
				var data = that.parseDataFromOSC( msg[0], msg[1] );
				console.log( 'decode /user/ message ' +  data.userid );
				that._onFrameUpdate( data );
			}
		});
	},
	onFrameUpdate: function( data ){ /* override me */ },
	_onFrameUpdate: function( data ){
		if( typeof this.onFrameUpdate === 'function' )
			this.onFrameUpdate( data );
	},
	addUser: function( id ){
		this.users[ id ] = true;
	},
	removeUser: function( id ){
		this.users[ id ] = false;
	},
	skeletonToMetrics: function( skeleton ){
		var leftHand = new _o.vec( skeleton.leftHand.x, skeleton.leftHand.y, skeleton.leftHand.z );
		var rightHand = new _o.vec( skeleton.rightHand.x, skeleton.rightHand.y, skeleton.rightHand.z );
		var bodyBottom = (skeleton.leftFoot.y > skeleton.rightFoot.y ) ? skeleton.leftFoot.y : skeleton.rightFoot.y;
		var bodyTop = skeleton.head.y;

		var metrics = {
			armSpan: rightHand.distanceTo( leftHand ),
			height: bodyBottom - bodyTop,
			leftHandRaised: ( skeleton.leftHand.y < skeleton.neck.y ),
			rightHandRaised: ( skeleton.rightHand.y < skeleton.neck.y )
		};

		return metrics;
	},
	parseDataFromOSC: function( tag, msg ){
		var user = parseInt( tag.replace( "/user/", "").replace( "/skeleton", "" ) );
		var messageObject = JSON.parse( msg );
		var metrics = this.skeletonToMetrics( messageObject );
		var data = {
			timestamp: (new Date()).getTime(),
			userid: user,
			skeleton: messageObject,
			metrics: metrics
		};
		return data;
	},

};

module.exports = Kinect;


