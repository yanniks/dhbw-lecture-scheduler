this.createSocket = function() {
	var express = require('express');
	var protobuf = require('./protobuf.js');
	var jsonCourses = {"wwi2016a":{"title":"WWI2016A"}, "wwi2015a":{"title":"WWI2015A"}};
	var pl = require('./parseLectureSchedule/parseLectures.js');
	var app = express();
	console.log("Created!");
	app.get('/lectures', function (req, res) {
		var data = req.query.course;
		console.log("Received " + data);
		if (jsonCourses[data]) {
			pl.parseLectures(data, function(lectures) {
				if (req.get('Accept') === 'application/protobuf') {
					protobuf.generateProtobufForCourse(lectures, function (protocolBuffer) {
						res.type('application/protobuf');
						res.send(protocolBuffer);
					});
				} else if (req.get('Accept') === 'application/json') {
					res.type('application/json');
					res.send(JSON.stringify(lectures));
				} else {
					res.type('text/calendar');
					var ical = "BEGIN:VCALENDAR\nVERSION:2.0\n";
					ical += "X-WR-CALNAME:Vorlesungsplan " + jsonCourses[data].title + "\n";
					lectures.forEach(function(event) {
						ical += "BEGIN:VEVENT\n";
						ical += "SUMMARY:" + event.title + "\n";
						ical += "DTSTART:" + event.begin.replace(/-/g, '').replace(/:/g, '') + "\n";
						ical += "DTEND:" + event.end.replace(/-/g, '').replace(/:/g, '') + "\n";
						ical += "LOCATION:" + event.location + "\n";
						if (event.prof) {
							ical += "ORGANIZER;CN=\"" + event.prof + "\"";
						}
						ical += "STATUS:CONFIRMED\n";
						ical += "END:VEVENT\n";
					})
					ical += "END:VCALENDAR\n";
					res.send(ical);
				}
			});
			return;
		}
		res.type('application/json');
		res.send(JSON.stringify({error:'Course not supported.'}));
	});
	app.get('/courses', function (req, res) {
		if (req.get('Accept') === 'application/protobuf') {
			protobuf.generateProtobufCourseList(jsonCourses, function (protocolBuffer) {
				res.type('application/protobuf');
				res.send(protocolBuffer);
			});
		} else {
			res.type('application/json');
			res.send(JSON.stringify(jsonCourses));
		}
	})
	app.listen(process.env.PORT || 3000, function () {
	  console.log('dhbw-lecture-scheduler listening on port ' + (process.env.PORT || 3000) + '!');
	});
}