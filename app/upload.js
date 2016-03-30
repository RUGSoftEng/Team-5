define(['app/database', 'jquery', 'bootstrap', 'xlsx', 'parsley', 'bootstrap-select', 'app/selectLanguage', 'app/selectSubject', 'app/date'], function (db, $, bootstrap, XLSX, parsley, select, selectLanguage, selectSubject, date) {
	var X = XLSX;
	var saveData;
	var correctUpload = false;

	// Script for evaluating the input of the upload form
	$(function () {
		$(".selectpicker").selectpicker();
		window.Parsley.on('field:error', function() {
				if (this.$element.is("select")) {
						this.$element.parent().children('.selectpicker').selectpicker('setStyle', 'alert-danger').selectpicker('refresh');
				}
		});
		window.Parsley.on('field:success', function() {
				if (this.$element.is("select")) {
						this.$element.parent().children('.selectpicker').selectpicker('setStyle', 'alert-success', 'add').selectpicker('setStyle', 'alert-danger', 'remove').selectpicker('refresh');
				}
		});
		$('select').on('changed.bs.select', function (e) {
			$(this).selectpicker('setStyle', 'alert-success', 'add').selectpicker('setStyle', 'alert-danger', 'remove').selectpicker('refresh');
			$(this).parent().children(".parsley-errors-list").html("");
		});
		$('select').on('rendered.bs.select', function (e) {
			$(this).parent().removeClass("parsley-error");
		});

		window.Parsley.addValidator('datasetName', {
		  validateString: function(value, requirement) {
				db.getQuery("getDatasetByName", [value], function() {
					return false;
				})
		  },
		  messages: {
		    en: 'This name is already used for another dataset.'
		  }
		});

		// Initiate form error and success handling
		$('#uploadForm').parsley().on('field:validated', function() {
			var ok = $('.parsley-error').length === 0;
			$('.bs-callout-info').toggleClass('hidden', !ok);
			$('.bs-callout-warning').toggleClass('hidden', ok);
		})
		.on('form:submit', function() {
			return false; // Don't submit form
		})
		.on('form:success', function() {
			var name = $('#uploadForm').find('input[name="name"]').val();
			var language = $('#uploadForm').find('select[name="language"]').prop("value");
            var subjectname = $('#uploadForm').find('select[name="language"]').val();
			var subject = $('#uploadForm').find('select[name="subject"]').prop("value");
			var currentdate = date.formatDate(new Date());

			db.executeQuery("addDataset", [0, name, language, subject, 0, 0, currentdate, currentdate]);
            db.save();
			var dataset = false;
            var row  = db.getQuery("getDatasetByName",[name]);
            var datasetId = row[0].dataset_id;
			process_data(JSON.parse(saveData), datasetId);

		});
	});

	window.Parsley.addValidator('fileXlsx', {
		validateString: function(_value, maxSize, parsleyInstance) {
			return correctUpload;
		},
		requirementType: 'integer',
		messages: {
			en: 'This file is not supported.',
			fr: "Ce fichier est plus grand que %s Kb."
		}
	});

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

	function xw_xfer(data, cb) {
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

	function process_data(data,datasetId) {
		var output = to_json(data);
		var sheetName = Object.keys(output)[0];
		$.each(output[sheetName], function (i, item) {
			var question = output[sheetName][i].question;
			var answer = output[sheetName][i].answer;
			var hint = (output[sheetName][i].hint == null) ? "" : output[sheetName][i].hint;
			db.executeQuery('addDatasetItem' , [datasetId, question, answer, hint]);
		})
        db.close();
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
			xw_xfer(data, process_data);
		};
		reader.readAsBinaryString(f);
	}

	var xlf = document.getElementById('xlf');
	if (xlf.addEventListener) {
		xlf.addEventListener('change', handleFile, false);
	}

	return {
		saveToDatabase: function() {
			console.log(saveData);
		}
	}
});
