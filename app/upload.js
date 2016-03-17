define(['app/database', 'jquery'], function (db, $) {
	var X = XLSX;
	var XW = {
		/* worker message */
		msg : 'xlsx',
		/* worker scripts */
		rABS : './lib/xlsx/xlsxworker.js',
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
				break;
			case 'e':
				console.error(e.data.d);
				break;
			default:
				xx = ab2str(e.data).replace(/\n/g, "\\n").replace(/\r/g, "\\r");
				console.log("done");
				cb(JSON.parse(xx));
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

	function process_wb(wb) {
		var output = to_json(wb);
		var sheetName = Object.keys(output)[0];

		$.each(output[sheetName], function (i, item) {
			var question = output[sheetName][i].question;
			var answer = output[sheetName][i].answer;
			db.excuteQuery(0, ['datasets1', question, answer, 'hint']);
			console.log("Question: " + question + ", answer: " + answer);
		})

		db.close();
		// window.location = "learn.html";
	}

	var drop = document.getElementById('drop');

	function handleDragover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
	}
	if (drop.addEventListener) {
			drop.addEventListener('dragenter', handleDragover, false);
			drop.addEventListener('dragover', handleDragover, false);
			drop.addEventListener('drop', handleDrop, false);
	}

	function handleDrop(e) {
		e.stopPropagation();
		e.preventDefault();
		var files = e.dataTransfer.files;
		readFile(files, e);
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
			xw_xfer(data, process_wb);
		};
		reader.readAsBinaryString(f);
	}

	var xlf = document.getElementById('xlf');
	if (xlf.addEventListener) {
		xlf.addEventListener('change', handleFile, false);
	}

});
