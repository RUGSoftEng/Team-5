define(['app/database', 'jquery', 'bootstrap', 'app/lang', 'app/string', 'xlsx', 'parsley', 'app/select', 'app/forms', 'app/ready', 'async'], function (db, $, bootstrap, lang, string, XLSX, parsley, select, forms, ready, async) {
	var X = XLSX;
	var saveData;
	var correctUpload = false;

	// Function for saving all items in the dataset
	function saveDatasetItemsIntoDatabase(data,name) {
		var output = to_json(data);
		var sheetName = Object.keys(output)[0];

		$.each(output[sheetName], function (i, item) {
			var question = output[sheetName][i].question;
			var answer = output[sheetName][i].answer;
			var hint = (output[sheetName][i].hint == null) ? "" : output[sheetName][i].hint;
			db.executeQuery('addDatasetItem' , [name, question, answer, hint]);
		});
	}
	// Function for showing the user the system is loading
	function showLoading(onSuccess) {
		$("#loadFrame").children("h1").html(lang("open_busysaving"))
		$("#loadFrame").fadeIn(300, onSuccess);
	}
	
	// Write localisable text to the page
	string.fillinTextClasses();
	$("#datasetname").prop("placeholder", lang("placeholder_name"));
	$("#datasetsubject").prop("title", lang("placeholder_subject"));
	$("#buttonsave").prop("value", lang("open_buttonsave"));

	ready.on(function() {
		// Check in the database if the name of the dataset already exists
		window.Parsley.addValidator('datasetName', {
			validateString: function(value, requirement) {
				var result = db.getQuery("getDatasetByName", [value]);
				return (result.length==0);
			},
			messages: {
				en: lang("error_datasetnamenotunique")
			}
		});
		// Check if the file uploaded file is correct (see xw_xfer)
		window.Parsley.addValidator('fileXlsx', {
			validateString: function(_value, maxSize, parsleyInstance) {
				return correctUpload;
			},
			requirementType: 'integer',
			messages: {
				en: lang("error_unsupportedfiletype")
			}
		});

		// Get value of form input
		function getFormVal(parentName, formType, formName) {
	    return $(parentName).find(formType + '[name="' + formName + '"]').val();
	  }

		// Script for evaluating the input of the upload form
	  forms.initializeForm('#uploadForm', function() {
			showLoading(function () {
				var form = '#uploadForm';
				forms.saveDataset(form);
				// Save all items of the dataset
		    var id = db.lastInsertRowId("tbldatasets", "dataset_id");
				saveDatasetItemsIntoDatabase(JSON.parse(saveData), id);
				db.close();
				var language = getFormVal(form, "select", "language");
	      var subject = getFormVal(form, "select", "subject");
				window.location = "index.html?message=open_dataset&language="+language+"&subject="+subject;
			});
		});

		// Initiate select boxes
		select.initiate("languages", ".selectLanguage");
		select.initiate("subjects", ".selectSubject");

		// Highlight upload area when dragging files
		$(document).on("dragenter", function() {
			$("#xlf").addClass("dragging");
		}).on("drop", function() {
			$("#xlf").removeClass("dragging");
		});

		// Prevent Electron from opening files when dragging
		document.addEventListener('dragover',function(event) {
			if (event.target.id!="xlf") {
				event.preventDefault();
		    return false;
			}
	  },false);

	  document.addEventListener('drop',function(event){
			if (event.target.id!="xlf") {
				event.preventDefault();
				return false;
			}
	  },false);
	});


	/* Scripts for reading and processing the XLS files.
	 * See https://github.com/SheetJS/js-xlsx for reference
	 */
	var XW = {
		/* worker message */
		msg : 'xlsx',
		/* worker scripts */
		rABS : './node_modules/xlsx/xlsxworker2.js',
	};

	var rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined";

	function ab2str(data) {
		var o = "",
		l = 0,
		w = 10240;
		for (; l < data.byteLength / w; ++l)
			o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w, l * w + w)));
		o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w)));
		return o;
	}

	function s2ab(s) {
		var b = new ArrayBuffer(s.length * 2),
		v = new Uint16Array(b);
		for (var i = 0; i != s.length; ++i) {
			v[i] = s.charCodeAt(i);
		}
		return [v, b];
	}

	function xw_xfer(data) {
		var worker = new Worker(XW.rABS);
		worker.onmessage = function (e) {
			switch (e.data.t) {
			case 'ready':
				correctUpload = true;
				break;
			case 'e':
				correctUpload = false;
				console.error(e.data.d);
				break;
			default:
				saveData = ab2str(e.data).replace(/\n/g, "\\n").replace(/\r/g, "\\r");
				break;
			}
		};
		var val = s2ab(data);
		worker.postMessage(val[1], [val[1]]);

	}

	function to_json(workbook) {
		var result = {};
		workbook.SheetNames.forEach(function (sheetName) {
			var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
			if (roa.length > 0) {
				result[sheetName] = roa;
			}
		});

		return result;
	}

	function handleFile(e) {
		var files = e.target.files;
		readFile(files, e);
	}

	function readFile(files, e) {
		console.log('readfile');
		var f = files[0];
		var reader = new FileReader();
		var name = f.name;
		reader.onload = function (e) {
			if (typeof console !== 'undefined') {
				console.log("onload", new Date(), true, true);
			}
			var data = e.target.result;
			xw_xfer(data);
		};
		reader.readAsBinaryString(f);
	}
	// Initiate upload box
	var xlf = document.getElementById('xlf');
	if (xlf.addEventListener) {
		xlf.addEventListener('change', handleFile, false);
	}
});
