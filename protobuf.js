var proto = require("./protos/protos.js")

this.generateProtobufForCourse = function(json, callback) {

	    // Obtain a message type
	    var Lecture = proto.dhbw.servercommunication.Lecture;
		var ServerLectureResponse = proto.dhbw.servercommunication.ServerLectureResponse;

	    // Create a new message
		var lecturesArray = [];
		for (i in json) {
			var lect = json[i];
			var protobufObject = Lecture.create(lect);
			lecturesArray.push(protobufObject);
		}
		
		var response = ServerLectureResponse.create({ "lectures": lecturesArray });
	    // Encode a message to an Uint8Array (browser) or Buffer (node)
	    var buffer = ServerLectureResponse.encode(response).finish();
		callback(buffer);
}
this.generateProtobufCourseList = function(json, callback) {
    // Obtain a message type
    var Course = proto.dhbw.servercommunication.Course;
	var ServerCourseResponse = proto.dhbw.servercommunication.ServerCourseResponse;

    // Create a new message
	
	var coursesArray = [];
	for (key in json) {
		var protobufObject = Course.create({id: key, title: json[key].title});
		coursesArray.push(protobufObject);
	}
	
	var response = ServerCourseResponse.create({ "courses": coursesArray });
    // Encode a message to an Uint8Array (browser) or Buffer (node)
    var buffer = ServerCourseResponse.encode(response).finish();
	callback(buffer);
}
