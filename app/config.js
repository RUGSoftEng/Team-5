/* file: config.js
 * authors: H. Bouakaz, S. van Vliet, S. de Jong & E. Werkema
 * date: 19/03/2016
 * version 1.1
 *
 * Description:
 * Initialization of variables and constants.
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
  
	var constants = {
		TOTAL_LENGTH: items.length,
		NUMBER_TUTORIAL_QUESTIONS: 3,
		MARGIN_OF_ERROR: 0.2,
		TUTORIAL_MODE: true,
    TIME_LIMIT: 600,
    DATABASE_USER: "./database/user.sqlite",
    DATABASE_SLIMSTAMPEN: "./database/slimstampen.sqlite"
	};

	return {
		items: function() {
			return items;
		},
		constant: function(name) {
			return constants[name];
		}
	}
});
