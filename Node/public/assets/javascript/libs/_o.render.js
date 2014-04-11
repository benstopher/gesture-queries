// Copyright (c) 2013 Oliver Smith, http://ollyjsmith.com
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// 'Software'), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//


(function( global ){


// SETUP
	if( !global._o ){
		throw new Error( '_o is not defined: required for use of this module.');
	}
	var _o = global._o;
	
	if( !_o.MODULES ){
		_o.MODULES = [];
	}
	
	_o.MODULES.push( "render" );

	_o.render = {
		circle: function( ctx, x, y, r ){
			ctx.arc( x, y, r, 0, Math.PI * 2 );
		},
		fillCircle: function( ctx, x, y, r  ){
			 ctx.beginPath();
			 _o.render.circle( ctx, x, y, r );
			 ctx.closePath();
			 ctx.fill();
		},
		strokeCircle: function( ctx, x, y, r  ){
			 ctx.beginPath();
			 _o.render.circle( ctx, x, y, r );
			 ctx.closePath();
			 ctx.stroke();
		}
	}



// END _o.render

})( typeof window === 'undefined' ? this : window );

// END
