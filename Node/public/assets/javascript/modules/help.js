var help = {
	colours: [
		"#35EAE6",
		"#CB99E9",
		"#FFF053",
		"#BCFF46",
		"#3DDD62",
		"#4758FF",
		"#7A3AFF",
		"#F69969",
		"#EA405C"
	],
	randomColour: function(){
		//http://stackoverflow.com/a/13563700
		return "hsl(" + Math.random() * 360 + ",100%,50%)";
	}
}