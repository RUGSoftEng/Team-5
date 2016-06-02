define(['app/database', 'jquery', 'bootstrap', 'parsley', 'app/select', 'app/forms', 'app/ready', 'async', 'app/lang', 'app/string', 'app/user', 'app/date'], function (db, $, bootstrap, parsley, select, forms, ready, async, lang, string, user, date) {
	var X = XLSX;
	var saveData;
	var correctUpload = false;

	// Function for saving all items in the dataset
	function createDatasetItems(data) {
		data = JSON.parse(data);
		var output = to_json(data);
		var sheetName = Object.keys(output)[0];
		var dataset_items = [];

		$.each(output[sheetName], function (i, item) {
			var question = output[sheetName][i].question;
			var answer = output[sheetName][i].answer;
			var hint = (output[sheetName][i].hint === null) ? "" : output[sheetName][i].hint;
			dataset_items.push({"id": i, "text": question, "answer": answer, "hint": hint});
		});

		return JSON.stringify(dataset_items);
	}

	function localisePage() {
		string.fillinTextClasses();
		$("#datasetname").prop("placeholder", lang("placeholder_datasetname"));
		$("#datasetsubject").prop("title", lang("placeholder_subject"));
		$("#customsubject").prop("placeholder", lang("label_customsubject"));
		$("#buttonsave").prop("value", lang("open_buttonsave"));
		$("#popoverSubject").prop("title", lang("label_subject"));
		$("#popoverSubject").data("content", lang("tutorial_datasetsubject"));
		$("#popoverLanguage").prop("title", lang("label_language"));
		$("#popoverLanguage").data("content", lang("tutorial_datasetlanguage"));
		$("#popoverWhatfile").prop("title", lang("open_whatfile"));
		$("#popoverWhatfile").data("content", lang("tutorial_whatfile") + "<br><br><img src='resources/images/inputfilelayout.png' />");
	}
	function getUserDataFromDatabase() {
		$("span[data-replace]").each(function() {
			var user_info = $(this).data("replace");
			var text = user.get(user_info);
			$(this).html(text);
		});
		$("span[data-username]").html(user.get("user_firstname")+" "+user.get("user_lastname"));
	}

	function checkIfDatasetExists() {
		window.Parsley.addValidator('datasetName', {
			validateString: function(value, requirement) {
				var result = db.getQuery("getDatasetByName", [value]);
				return (result.length===0);
			},
			messages: {
				en: lang("error_datasetnamenotunique")
			}
		});
	}

	function handleCustomSubject() {
		window.Parsley.addValidator('subjectName', {
			validateString: function(value, requirement) {
				var result = db.getQuery("getSubjectByName", [value]);
				return result.length === 0;
			},
			messages: {
				en: lang("error_subjectnamenotunique")
			}
		});

		// Display the input for custom subject only if appropriate
		$("#datasetsubject").change(function() {
			var id = forms.getFormVal("#uploadForm", "select", "subject");
			$("#datasetsubject").data("subject", id);

			if (id == 0) {
				$("#newsubject").attr("hidden", false);
				$("#customsubject").attr("required", "");
				$("#customsubject").attr("data-parsley-subject-name", "1");
			} else {
				$("#newsubject").attr("hidden", true);
				$("#customsubject").removeAttr("required");
				$("#customsubject").removeAttr("data-parsley-subject-name");
			}
		});
	}

	function saveDatasetOnline(data, language, subject) {
		db.executeQuery("addDataset", data, false, true);
		db.lastInsertIdOnline('tbldatasets', 'dataset_id', function (id) {
			data.unshift(id);
			db.executeQuery("addDatasetAll", data, true, false);
			db.close();
			window.location = "index.html?message=open_dataset&language="+language+"&subject="+subject;
		});
	}

	function checkCorrectnessFile() {
		window.Parsley.addValidator('fileXlsx', {
			validateString: function(_value, maxSize, parsleyInstance) {
				return correctUpload;
			},
			requirementType: 'integer',
			messages: {
				en: lang("error_unsupportedfiletype")
			}
		});
	}

	function saveDatasetOnlineAndLocal(language, subject, data) {
		db.executeQuery("addDataset", data, false, true);
		db.lastInsertIdOnline('tbldatasets', 'dataset_id', function (id) {
			data.unshift(id);
			db.executeQuery("addDatasetAll", data, true, false);
			db.close();
			window.location = "index.html?message=success_opendataset&language="+language+"&subject="+subject;
		});
	}

	function evaluateInputOfForm() {
		var form = '#uploadForm';
		forms.initialize(form);
		forms.onSuccess(form, function() {
			ready.showLoading(lang("open_busysaving"), function () {
				var form = '#uploadForm';
				var name = forms.getFormVal(form, "input", "name");
	      var language = forms.getFormVal(form, "select", "language");
	      var subject = $("#datasetsubject").data("subject");
	      var user_id = user.getCookie('user_id');
	      var currentdate = date.formatDatetime(new Date(), true);

				var dataset_items = createDatasetItems(saveData);

				if (db.online()) {
					if (subject === 0) {
						var newsubjectname = $("#customsubject").val();
						db.executeQuery("addSubjectOnline", [newsubjectname, user.getCookie("user_id"), 1], false, true);
						db.lastInsertIdOnline('tblsubjects', 'subject_id', function (subject_id) {
							db.executeQuery("addSubject", [subject_id, newsubjectname, user.getCookie("user_id"), 1], true, false);
							saveDatasetOnlineAndLocal(language, subject, [user_id, name, language, subject, 0, 0, 1, currentdate, currentdate, dataset_items,'[]']);
						});
					} else {
						saveDatasetOnlineAndLocal(language, subject, [user_id, name, language, subject, 0, 0, 1, currentdate, currentdate, dataset_items,'[]']);
					}
				} else {
					if (subject === 0) {
						subject = db.lastInsertRowId("tblsubjects", "subject_id") + 1;
						var newsubjectname = $("#customsubject").val();
						db.executeQuery('addSubject' , [subject, newsubjectname, user.getCookie("user_id"), 0]);
					}
					db.executeQuery("addDatasetAll", [null, user_id, name, language, subject, 0, 0, 0, currentdate, currentdate, dataset_items,'[]'], true, false);
					db.close();
					window.location = "index.html?message=success_opendataset&language="+language+"&subject="+subject;
				}
			});
		});
	}

	function highlightUploadOnDrag() {
		$(document).on("dragenter", function() {
			$("#xlf").addClass("dragging");
		}).on("drop", function() {
			$("#xlf").removeClass("dragging");
		});
	}

	function preventOpenOnDrag() {
		document.addEventListener('dragover',function(event) {
			if (event.target.id!="xlf") {
				event.preventDefault();
		    return false;
			}
	  	},false);
	}

	function initiateUploadBox() {
		var xlf = document.getElementById('xlf');
		if (xlf.addEventListener) {
			xlf.addEventListener('change', handleFile, false);
		}
	}

	ready.on(function() {
		localisePage();
		getUserDataFromDatabase();
		checkIfDatasetExists();
		handleCustomSubject();
		checkCorrectnessFile();
		evaluateInputOfForm();
		
		$('#popoverSubject').popover();
		$('#popoverLanguage').popover();
		$('#popoverWhatfile').popover({template: '<div class="popover popoverwide" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'});

		// Initiate select boxes
		select.initiate("languages", ".selectLanguage");
		select.initiate("subjects", ".selectSubject");

		highlightUploadOnDrag();
		preventOpenOnDrag();


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
	initiateUploadBox();

});
