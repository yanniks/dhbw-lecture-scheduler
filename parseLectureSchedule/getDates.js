var createday = require('./createDay.js');
var getprof = require('./getProf.js');

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function updateTitle(title) {
	var appointment = title.trim();
	appointment = appointment.replace("IuF","Investition und Finanzierung");
	return appointment;
}

function ISODateString(d) {
 function pad(n){return n<10 ? '0'+n : n}
 return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'Z'}

function generateDateObject(date, time, end) {
	var year = date.substring(0, 4);
	var month = date.substring(4, 6);
	var day = date.substring(6, 8);
	var date = new Date(year, month, day);
	if (time) {
		var split = time.split(':');
		var hour = split[0];
		var minute = split[1];
		date = new Date(year, month, day, hour, minute);
	} else if (end) {
		date.setDate(date.getDate() + 86400000);
	}
	return ISODateString(date);
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