this.createSocket = function() {
	var io = require('socket.io')();
	var protobuf = require('./protobuf.js');
	var pl = require('./parseLectureSchedule/parseLectures.js');
	console.log("Created!");
	io.on('connection', function(client){
		console.log("Connected!");
		var jsonCourses = {"wwi2016a":{"title":"WWI2016A"}, "wwi2015a":{"title":"WWI2015A"}};
		client.on('requestLectures', function(data) {
			if (jsonCourses["wwi2016a"]) {
				pl.parseLectures(data, function(lectures) {
					protobuf.generateProtobufForCourse(lectures, function (protocolBuffer) {
						client.emit('lectures', protocolBuffer);
					});
				});
			}
			console.log("Received " + data);
		});
		client.on('listCourses', function(data) {
			protobuf.generateProtobufCourseList(jsonCourses, function (protocolBuffer) {
				client.emit('courses', protocolBuffer);
			});
		});
		client.on('disconnect', function(){
			console.log("Disconnected!");
		});
	});
	io.listen(process.env.PORT || 3000);
}
