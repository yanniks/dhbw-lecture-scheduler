var createday = require('./createDay.js');
var getprof = require('./getProf.js');
var moment = require('moment-timezone');

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function updateTitle(title) {
	var appointment = title.trim();
	appointment = appointment.replace("IuF","Investition und Finanzierung");
	return appointment;
}

function generateDateObject(date, time, end) {
	var year = date.substring(0, 4);
	var month = date.substring(4, 6);
	var day = date.substring(6, 8);
	var date = new Date(Date.UTC(year, month, day));
	var timestring = year + month + day;
	var m = moment(timestring, "YYYYMMDD");
	if (time) {
		var split = time.split(':');
		var hour = split[0];
		var minute = split[1];
		m.set('hour', hour);
		m.set('minute', minute);
	} else if (end) {
		m.add(1, 'day');
	}
	m.tz('UTC');
	return m.format();
}

this.getDates = function(course, content, callback) {
	createday.createDay(content, function(days) {
		var output = [];
		for (dayi in days) {
			var day = days[dayi];
			var date = day[0].split(', ')[1];
			date = date.split('.');
			date = date.reverse().join('');
			day.shift();
			var timeframe = "";
			var appointment = "";
			var loc = "";
			for (linei in day) {
				var line = day[linei];
				line = line.replace("XXX","");
				var isDate = false;
				if (line.includes(' - ')) isDate = true;
				else {
					if (line.includes('-')) {
						var lineexp = line.split(' ');
						for (stri in lineexp) {
							var str = lineexp[stri];
							var strexp = str.split('-');
							for (parti in strexp) {
								var part = strexp[parti];
								var strtocheck = part.replace(/\./g,'');
								if (isNumeric(strtocheck) && strtocheck.length == 4)
									isDate = true;
							}
						}
					}
					if (!isDate) {
						var lineexp = line.split(' ');
						for (stri in lineexp) {
							var str = lineexp[stri];
							var strtocheck = str.replace(/\./g,'');
							if (isNumeric(strtocheck) && strtocheck.length == 4)
								isDate = true;
						}
					}
				}
				if (isDate) {
					if (appointment != "") {
						appointment = updateTitle(appointment);
						var timesplit = timeframe.replace(/\./g,':').split('-');
						var ap = {date: date, title: appointment};
						if (timesplit[0])
							ap.begin = timesplit[0].trim().split(' ')[0];
						if (timesplit[1])
							ap.end = timesplit[1].trim();
						if (getprof.getProf(appointment, course))
							ap.prof = getprof.getProf(appointment, course);
						if (loc)
							ap.location = loc;
						else
							ap.location = "Raum 4.10";
						output.push(ap);
					}
					appointment = "";
					if (line.match("/[a-z]/i")) {
						var lineexp = line.split(' ');
						for (stri in lineexp) {
							var strtocheck = str.replace(/\./g,'');
							if (!isNumeric(strtocheck) && strtocheck.length != 4) {
								appointment += str;
							}
						}
					}
					var timeframe = line;
				} else if (line.includes("Raum ") || line.includes("R. ") || line.includes("P50 ")) {
					loc = line;
				} else if (line != "" && !line.includes("Woche ")) {
					if (line[line.length - 1] == "-") {
						line = line.substr(0,line.length-1);
						appointment += line;
					} else {
						appointment += line + " ";
					}
				}
			}
			if (appointment != "") {
				appointment = updateTitle(appointment);
				var timesplit = timeframe.replace(/\./g,':').split('-');
				var ap = {date: date, title: appointment};
				if (timesplit[0])
					ap.begin = timesplit[0].trim().split(' ')[0];
				if (timesplit[1])
					ap.end = timesplit[1].trim();
				if (getprof.getProf(appointment, course))
					ap.prof = getprof.getProf(appointment, course);
				if (loc)
					ap.location = loc;
				else
					ap.location = "Raum 4.10";
				output.push(ap);
			}
		}
		
		for (i in output) {
			var item = output[i];
			item.begin = generateDateObject(item.date,item.begin,false);
			item.end = generateDateObject(item.date,item.end,true);
			delete item.date;
		}
		callback(output);
	})
}