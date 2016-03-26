/* file: welcome.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 17/3/2016
 * version 1.1
 *
 * Description:
 * Main script for initiating the welcome  page.
 */

define(['jquery', 'app/database', 'bootstrap'], function ($, db, bootstrap) {

	$("#menu-toggle").click(function (e) {
		e.preventDefault();
		$("#wrapper").toggleClass("toggled");
	});

	function createSidebarElements() {
		var li1 = "<li class=\"sidebar_li\" id=\"";
		var li2 = "\"><a  href=\"#\"  >";
		var li3 = "<br><span class=\"sidebar_item\" >for English speakers</span></a></li>\n";
		var rows = db.getQuery('getUserSubjects', []);
		var sidebar = "";

		for (var i = 0; i < rows.length; i++) {
			sidebar += li1 + rows[i].subject_id + li2 + rows[i].subject_name + li3;
		}

		var container = document.getElementById("sidebar_ul");
		container.innerHTML = sidebar;
	}

	function createDatasetsGrid(index) {
		var grid = "";
		var rows = db.getQuery('getDatasets', [index]);
		var gridItem1 = "<div class=\"col-md-3 col-sm-6\">\n<div class=\"btn mybutton\" id=\"";
		var gridItem2 = "\" >\n<h3>";
		var gridItem3 = "</h3>\n <br><h4>Strength:</h4><center>\n<div class=\"progress\" style=\"width:80%\"><div class=\"progress-bar progress-bar-success progress-bar-striped\" role=\"progressbar\" aria-valuenow=\"68\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 68%;\"></div></div></center></div></div>\n";
		for (var i = 0; i < rows.length; i++) {
			console.log(rows[i]);
			grid += gridItem1+ rows[i].dataset_id + gridItem2 + rows[i].dataset_name + gridItem3;
		}
		var container = document.getElementById("container");
		container.innerHTML = grid;
	}

	$(document).ready(function () {
		console.log("ready!");
		createSidebarElements();
		$(".sidebar_li").click(function () {
			var contentPanelId = $(this).attr("id");
			createDatasetsGrid(contentPanelId);
					$(".mybutton").click(function () {
						var contentPanelId = $(this).attr("id");
						alert(contentPanelId);
					});
		});
		


	});

	function addRandom() {
		var date = new Date();
		var a = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
		console.log(a);

		/*db.executeQuery('addDataset', [1,'Travail',1,1,0,0, a,a]);
		db.executeQuery('addDataset', [1,'Tourism',1,1,0,0, a, a]);
		db.executeQuery('addDataset', [1,'Animaux',1,1,0,0, a, a ]);
		db.executeQuery('addDataset', [1,'Ecole',1,1,0,0, a, a ]);
		db.executeQuery('addDataset', [1,'Most used',1,1,0,0, a, a ]);
		db.executeQuery('addSubject',[1,'French']);
		db.executeQuery('addSubject',[2,'Dutch']);
		db.executeQuery('addSubject',[3,'Spanish']);
		db.executeQuery('addSubject',[4,'Italian']);*/

		console.log(rows.length);
		for (var i = 0; i < rows.length; i++) {
			console.log(rows[i].dataset_name);
		}
		db.close();
		console.log('success');
	}

});
