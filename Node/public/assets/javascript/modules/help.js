var help = {
	linecolours: [
		"#139748",
		"#55BFB1",
		"#EB0020",
		"#BFD542",
		"#531B76"
	],
	piecolours: [
		[
			"#F6742C",
			"#55BFB1"
		],
		[
			"#55BFB1",
			"#139748"
			
		],
		[
			"#eb0020",
			"#139ece"
		]
	],
	randomColour: function(){
		//http://stackoverflow.com/a/13563700
		return "hsl(" + Math.random() * 360 + ",100%,50%)";
	}
}


if (typeof module === "object" && module.exports) module.exports = help;