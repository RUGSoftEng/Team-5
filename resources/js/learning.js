
$("form").bind("keypress", function (e) {
if (e.keyCode == 13) {
	checkAnswer();
	return false;
}
});

function checkAnswer(){
	var input=  document.getElementById("answer").value;
	var value = "goodmorning";
	var difference = levenshtein(input,value);
	if(difference == 0){
		$( '.alert' ).css("background-color", "green");
		$( '.alert' ).html( 'Well done!' );
	}else if(difference <2){
		$( '.alert' ).css("background-color", "orange");
		$( '.alert' ).html( 'Almost there! your answer: '+ input +' expected answer: ' + value +' '+difference +' letter (s) difference' );
	}else{
		$('.alert').css("background-color", "red");
		$( '.alert' ).html( 'Wrong answer!' );
	}
	
	$('#answer').val('');

}
