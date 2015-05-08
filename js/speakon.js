var Kon = Kon || function(){ };

var speechRecognition = (speechRecognition || webkitSpeechRecognition);

Kon.speech = new speechRecognition();

Kon.lastResult = null;

Kon.init = function() {
	console.log("INIT");
	Kon.speech.lang = "en_US";
	Kon.speech.continuous = true;
	Kon.speech.maxAlternatives = 1;
	Kon.speech.interimResults = true;
	Kon.speech.onend = Kon.reset;
	console.log(Kon.speech);
}

Kon.speak = function(text) {
	var params = arguments;
	var speaker = new SpeechSynthesisUtterance(text);
	speaker.onend = function(event) {	
		if (params[1] != undefined) {
			params[1]();
		}
	}
	window.speechSynthesis.speak(speaker);
}

/* ------------ */

Kon.reset = function() {
	Kon.isListening = false;
	console.log("Reset");
	if (Kon.onEnd != undefined) {
		Kon.onEnd();	
	}
}

Kon.stopListen = function() {
	if (Kon.isListening) {
		console.log("Stop");
		Kon.speech.stop();
		Kon.isListening = false;
	} 
}

Kon.startListen = function() {
	console.log("Start");
	Kon.stopListen();
	Kon.speech.start();
	Kon.isListening = true;
	Kon.lastResult = null;
}

Kon.speech.onerror = function(e) {
    var msg = e.error + " error";
    var errorCode = "";
    if (e.error === 'no-speech') {
        msg = "No speech was detected. Please try again.";
        errorCode = "E001";
    } else if (e.error === 'audio-capture') {
        msg = "Please ensure that a microphone is connected to your computer.";
        errorCode = "E002";
    } else if (e.error === 'not-allowed') {
        msg = "The app cannot access your microphone. Please go to chrome://settings/contentExceptions#media-stream and allow Microphone access to this website.";
        errorCode = "E003";
    }
    document.querySelector(".error").innerHTML = msg;
    if (Kon.onError != undefined) {
    	Kon.onError(errorCode);
    }
};


Kon.speech.onresult = function(e) {
	console.log(e);
	var results = [];
	var maxLength = 0;
	var maxLengthIndex = 0;

	if (e.results.length > 0) {
		for (var i = 0; i < e.results.length; i++) {
			var result = e.results[i][0];
			results.push(result);
			if (result.transcript.length > maxLength) {
				maxLength = result.transcript.length;
				maxLengthIndex = i;
			}
		}
	}

	if (Kon.onListen != undefined) {
		Kon.lastResult = results[maxLengthIndex];
		Kon.onListen(results[maxLengthIndex]);
	}
	Kon.stopListen();
}