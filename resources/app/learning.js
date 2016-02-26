var items = [
	{question: "Si", answer: "Yes"},
	{question: "No", answer: "No"},
	{question: "Grazie", answer: "Thank you"},
	{question: "Prego", answer: "You're welcome"},
	{question: "Per favore", answer: "Please"},
	{question: "Mi scusi", answer: "Excuse me"},
	{question: "Salve", answer: "Hello"},
	{question: "Arrivederci", answer: "Goodbye"},
	{question: "Addio", answer: "So long"},
	{question: "Buon giorno", answer: "Good morning"},
	{question: "Buon pomeriggio", answer: "Good afternoon"},
	{question: "Buona sera", answer: "Good evening"},
	{question: "Buona notte", answer: "Good night"},
	{question: "Non capisco", answer: "I don't understand"},
	{question: "Come si chiama?", answer: "What's your name?"},
	{question: "Piacere", answer: "Nice to meet you"},
	{question: "Come sta", answer: "How are you?"},
	{question: "Quanto costa?", answer: "How much does this cost?"},
	{question: "Cosa é questo?", answer: "What is this?"},
	{question: "Dove va?", answer: "Where are you going?"},
	{question: "Dove abiti?", answer: "Where do you live?"},
	{question: "Che ora é?", answer: "What time is it?"},
	{question: "Ieri", answer: "Yesterday"},
	{question: "Domani", answer: "Tomorrow"},
	{question: "Buon compleanno!", answer: "Happy Birthday!"}
	];

const TOTAL_LENGTH = items.length;
const NUMBER_OF_TUTORIAL_QUESTIONS = 3;
const ALLOWED_MARGIN_OF_ERROR = 0.2; // Scale 0:1

var i = 0;
var inTutorial = true;

function showProgress() {
	$( "#progress-number" ).html( "<p>" + (TOTAL_LENGTH - items.length) + "/" + TOTAL_LENGTH + " words</p>" );
	
	var percentage = Math.round((TOTAL_LENGTH - items.length) / TOTAL_LENGTH * 100);
	$( "#progress-bar" ).html(percentage + "%").attr("aria-valuenow", percentage).css("width", percentage+"%");
}

function showQuestion() {
	var question = items[i].question
	
	if (inTutorial) {
		question += "<br><b>Type the answer:</b> " + items[i].answer;
	}
	
	$( "#question" ).html( question );
}

window.onload=function() {
	showQuestion();
	showProgress();
}

$("form").bind("keypress", function (e) {
	if (e.keyCode == 13) {
		checkAnswer();
		
		if (inTutorial && i == NUMBER_OF_TUTORIAL_QUESTIONS) {
			i = 0;
			inTutorial = false;
		}
		
		showQuestion();
		return false;
	}
});

function checkAnswer() {
	var input=  document.getElementById("answer").value;
	var answer = items[i].answer;
	
	var difference = levenshtein(input,answer);
	if(difference == 0){
		$( ".alert" ).css("background-color", "green");
		$( ".alert" ).html( "Well done!" );
		if (!inTutorial) {
			items.splice(i,1);
			i %= items.length;
		} else {
			i++;
		}
	} else if (difference <= (answer.length * ALLOWED_MARGIN_OF_ERROR)) {
		$( ".alert" ).css("background-color", "orange");
		$( ".alert" ).html( "Almost there! Your answer: " + input + " - Expected answer: " + answer + " (" + difference + " letter(s) difference)" );
		i = (i + 1) % items.length;
	} else {
		$( ".alert" ).css("background-color", "red");
		$( ".alert" ).html( "Wrong answer! Expected answer: " + answer );
		i = (i + 1) % items.length;
	}

	$( "#answer" ).val( "" );
	
	showProgress();
	
	if (items.length == 0) {
		alert("Done!");
	}
}
