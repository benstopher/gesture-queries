var formatDate = function( date ){
	return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
} 

var getDateOfISOWeek = function(w, y) {
	//thanks: http://stackoverflow.com/a/16591175
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}

var generateWeeklySeries = function( _from, _to ){
	var from = ( _from ) ? new Date( _from ) : new Date( "1/4/2004" );
	var to = ( _to ) ? new Date( _to ) : new Date();
	var startYear = from.getFullYear();
	var endYear = to.getFullYear();
	var yearSpan = endYear - startYear;
	var data = [];

	for( var year = startYear; year < endYear; year++ ){
		for( var week = 0; week < 52; week++ ){
			var d = getDateOfISOWeek( week, year );
			d = formatDate( d );
			data.push({ date: d, value: 0 } );
		}
	}
	return data;
};

var generateTimeSeries = function( data, _time_field, _data_field ){
	var out = [];
	for( var i in data ){
		var d = data[ i ];
		out.push( {
			time: d[ _time_field ],
			value: d[ _data_field ]
		} );
	}
	return out;
}

console.log( generateTimeSeries( data, "timestamp", "hands" ) );

var DataToCorrelate = function(){

};


DataToCorrelate.prototype = {

};

module.exports = DataToCorrelate;