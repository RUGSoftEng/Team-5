/* file: welcome.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 17/3/2016
 * version 1.1
 *
 * Description:
 * Main script for initiating the welcome  page.
 */
 
 define([ 'jquery','app/database', 'bootstrap'], function ($,db,  bootstrap) {

	$("#menu-toggle").click(function(e) {
		e.preventDefault();
		$("#wrapper").toggleClass("toggled");
	});
	
	function addRandom(){
	var date =  new Date();
	var a = date.getFullYear()+"-"+ date.getMonth()+"-"+ date.getDate() +" "+date.getHours() + ":"+date.getMinutes(); 
	console.log(a);

	db.executeQuery('addDataset', [1,'Travail',1,1,0,0, a,a]);
	//db.executeQuery('addDataset', [1,'Tourism',1,1,0,0, getDateTime() , getDateTime() ]);
	//db.executeQuery('addDataset', [1,'Animaux',1,1,0,0, , getDateTime() ]);
	console.log('success');

}


function createDatasetsGrid(){
	var rows = db.executeQuery('addDatasetItem' , ['datasets1', question, answer, 'hint']);
	            "<div class=\"col-md-3 col-sm-6\">"+
            "<button type=\"button\" class=\"btn mybutton\" onclick=\"\">"+
             "<h3>"+"</h3> <br>" +
             "<h4>Strength:</h4>"+
             "<center>"+
             "<div class=\"progress\" style=\"width:80%\">"+
             "<div class=\"progress-bar progress-bar-success progress-bar-striped\" role=\"progressbar\" aria-valuenow=\"68\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 68%;\"></div>"+
            "</div></center></button></div>";
}

$( document ).ready(function() {
    console.log( "ready!" );
	addRandom();
});
	
	
	
	
});
