Kon.init();

var isStarted = false;

var currentSentence = 0;

function listen() {
	Kon.startListen();
	document.getElementById("said").innerHTML = "(Listening...)";
}

function showRetry() {
	document.getElementById("said").innerHTML = "Failed! Please try again!";
	document.getElementById("btnStart").className = document.getElementById("btnStart").className.replace("disabled", "");
	isStarted = false;	
}

Kon.onEnd = function() {
	if (Kon.lastResult == null) {
		showRetry();
	}
}

Kon.onListen = function(result) {
	if (!Kon.isListening) {
		if (result != undefined) {
			document.getElementById("said").innerHTML = result.transcript;
			checkSpeak();
		}
	}
}

Kon.onError = function(error) {
	console.log("Error: " + error);
	showRetry();
}

function nextSentence() {
	var current = document.querySelector("li:nth-child(" + (currentSentence + 1) + ")");
	if (current != null) {
		current.className = current.className.replace("active", "");
	}

	currentSentence++;

	var next = document.querySelector("li:nth-child(" + (currentSentence + 1) + ")");
	if (next != null) {
		next.className += "active";
	} else {
		document.querySelector(".status").innerHTML = "Well done!";
	}
}

function speakNext() {
	nextSentence();
	Kon.speak(document.querySelector("li:nth-child(" + (currentSentence + 1) + ")").innerHTML, function(){
		console.log("Next");
		nextSentence();
		listen();
	});
}

var speakTimer = null;
function checkSpeak() {
	if (speakTimer != null) {
		clearTimeout(speakTimer);
		speakTimer = null;
	}
	speakTimer = setTimeout(function(){
		
		var youSpeak = document.getElementById("said").innerHTML.toLowerCase();

		var currentSpeak = document.querySelector("li:nth-child(" + (currentSentence + 1) + ")").innerHTML;
		currentSpeak = currentSpeak.replace(/,/g, '').replace(/\./g, '').replace("?", "").toLowerCase();

		console.log("You: " + youSpeak);
		console.log("PC: " + currentSpeak);

		if (youSpeak == currentSpeak) {
			speakNext();
		} else {
			document.getElementById("said").innerHTML = "Please try again!";
			listen();
		}

	}, 500);
}

function startSpeak() {
	if (!isStarted) {
		document.querySelector(".error").innerHTML = "";
		document.getElementById("said").innerHTML = "Listen then answer...";
		isStarted = true;
		document.querySelector("button").className = "disabled";
		currentSentence = -1;
		var list = document.querySelectorAll("li");
		for (var i = 0; i < list.length; i++) {
			list[i].className = list[i].className.replace("active", "");
		}
		speakNext();
	}
}