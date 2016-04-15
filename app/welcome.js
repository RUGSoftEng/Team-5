/* file: welcome.js
 * authors: H. Bouakaz, S. de Vliet, S. de Jong & E. Werkema
 * date: 17/3/2016
 * version 1.1
 *
 * Description:
 * Main script for initiating the welcome  page.
 */

define(['jquery', 'app/database', 'bootstrap'], function ($, db, bootstrap) {

	var sudo = require('sudo-prompt');
	var options = {
		name: 'Ronomon',
		icns: '/path/to/icns/file', // (optional)
		};
	sudo.exec('echo hello', options, function(error, stdout, stderr) {});
	$("#menu-toggle").click(function (e) {
		e.preventDefault();
	$("#wrapper").toggleClass("toggled");
	});

	function createSidebarElements() {
		var li1 = "<li class=\"sidebar_li\" subject_id=\"";
    	var li2 = "\" language_id=\"";
		var li3 = "\"><a  href=\"#\"  >";
		var li4 = "<br><span class=\"sidebar_item\" >for ";
    	var li5 = " speakers</span></a></li>\n";
		var rows = db.getUnique('getModules', 'subject_name', []);
		var sidebar = "";

		for (var i = 0; i < rows.length; i++) {
			sidebar += li1 + rows[i].subject_id + li2 + rows[i].language_id + li3 + rows[i].subject_name + li4 + rows[i].language_name + li5;
		}

		var container = document.getElementById("sidebar_ul");
		container.innerHTML = sidebar;
	}

	function createDatasetsGrid(subjectid, languageid) {
		var grid = "";
		var rows = db.getQuery('getDatasets', [languageid, subjectid]);
		var gridItem1 = "<div class=\"col-md-3 col-sm-6\">\n<div class=\"btn mybutton\" id=\"";
		var gridItem2 = "\" >\n<h3>";
		var gridItem3 = "</h3>\n <br><h4>Strength:</h4><center>\n<div class=\"progress\" style=\"width:80%\"><div class=\"progress-bar progress-bar-success progress-bar-striped\" role=\"progressbar\" aria-valuenow=\"68\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 68%;\"></div></div></center></div></div>\n";
		for (var i = 0; i < rows.length; i++) {
			grid += gridItem1+ rows[i].dataset_id + gridItem2 + rows[i].dataset_name + gridItem3;
		}
		var container = document.getElementById("container");
		container.innerHTML = grid;
		$(".mybutton").click(function () {
				var datasetId = $(this).attr("id");
				window.location.href = "learn.html?"+datasetId ;
		});
	}

	$(document).ready(function () {
		createSidebarElements();
    createDatasetsGrid(1,1);
		$(".sidebar_li").click(function () {
			createDatasetsGrid($(this).attr("subject_id"), $(this).attr("language_id"));
			$(this).parents('.sidebar-nav').find('.active').removeClass('active').end().end();
	        $(this).addClass('active');
	        console.log("hello");
	        $(activeTab).show();
		});
	});
});
