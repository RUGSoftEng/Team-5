/* file: learning.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 5/3/2016
 * version 1.1
 *
 * Description:
 * Main script for initiating the app. Constants and variables are loaded
 * in from config.js and the functions from functions.js.
 */

define(function (require) {
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
  const ALLOWED_MARGIN_OF_ERROR = 0.2;

  var functions = require('./functions') ;
  
  // Start timer on top of the page (total time of the learning session in seconds)
  var timer = require('./timer');
  timer.startTimer(600); // TODO: Magic number 600; in the future, user will choose time in main menu.

  var currentItemIndex = 0;
  var inTutorial = true;

  // Disable autocomplete that provides suggestions when typing words
  $('input').attr('autocomplete', 'off');

  window.onload=function() {
  	showQuestion();
  	showProgress();
  }

  // Check whether the user is in tutorial mode.
  // If the user leaves tutorial mode, roll back to the first item.
  function checkTutorialStatus() {
  	if (inTutorial) {
  		if (currentItemIndex == NUMBER_OF_TUTORIAL_QUESTIONS) {
  			currentItemIndex = 0;
  		} else {
  			return true;
  		}
  	}

  	return false;
  }

  // Read the user input when the Enter key is pressed and evaluate it.
  // Then show the next question.
  $("form").bind("keypress", function (e) {
  	if (e.key == 'Enter') {
  		checkAnswer();
  		inTutorial = checkTutorialStatus();
  		showQuestion();
  	}
  });
});
