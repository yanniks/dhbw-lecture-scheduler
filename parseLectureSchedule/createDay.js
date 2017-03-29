var csv = require('csv');

function parseCsv(l, i, lin, callback) {
	if (l.length <= i) {
		callback(lin);
		return;
	}
	var li = l[i];
	csv.parse(li, function(err, line) {
		if (line) {
			lin.push(line[0]);
		}
		parseCsv(l, i+1, lin, callback);
	});
}

function dayLineArray(dayarrays, i, dlin, callback) {
	if (dayarrays.length <= i) {
		callback(dlin);
		return;
	}
	var days = dayarrays[i];
	var l = days.split("\n");
	var lin = [];
	parseCsv(l, 0, lin, function(lin) {
		dlin.push(lin);
		dayLineArray(dayarrays, i+1, dlin, callback);
	});
}

this.createDay = function(content, callback) {
	var rows = content.split("\n");
	var dayarrays = [];
	var lines = "";
	var weitere = false;
	var first = true;
	for (rowi in rows) {
		var row = rows[rowi];
		if (row.includes('Montag') || row.includes('Dienstag') || row.includes('Mittwoch') || row.includes('Donnerstag') || row.includes('Freitag')) {
			if (first) first = !first;
			else dayarrays.push(lines);
			lines = "";
		}
		if (row.includes("weitere Termine:")) weitere = true;
		if (!weitere) lines += row + "\n";
	}
	dayarrays.push(lines);
	var dlin = [];
	dayarrays.push(row);
	dayLineArray(dayarrays, 0, dlin, function(dlin) {
		var diffcourses = [];
		for (var i2=0;i2 < dlin.length; i2++) {
			if (dlin[i2][0]) {
				for (var i=0;i<dlin[i2][0].length;i++) {
					var aout = [];
					for (row1i in dlin[i2]) {
						var row1 = dlin[i2][row1i];
						if (row1)
							aout.push(row1[i]);
					}
					diffcourses.push(aout);
				}
			}
		}
		callback(diffcourses);
	});
}