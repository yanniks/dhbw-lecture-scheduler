import * as proto from "./protos/protos";

export function generateProtobufForCourse(json, callback) {

    // Obtain a message type
    const Lecture = proto.dhbw.servercommunication.Lecture;
    const ServerLectureResponse = proto.dhbw.servercommunication.ServerLectureResponse;

    // Create a new message
    const lecturesArray = [];
    json.forEach((lect) => {
        const protobufObject = Lecture.create(lect);
        lecturesArray.push(protobufObject);
    });

    const response = ServerLectureResponse.create({lectures: lecturesArray});
    // Encode a message to an Uint8Array (browser) or Buffer (node)
    const buffer = ServerLectureResponse.encode(response).finish();
    callback(buffer);
}
export function generateProtobufCourseList(json, callback) {
    // Obtain a message type
    const Course = proto.dhbw.servercommunication.Course;
    const ServerCourseResponse = proto.dhbw.servercommunication.ServerCourseResponse;

    // Create a new message

    const coursesArray = [];
    Object.keys(json).forEach ((key) => {
        const protobufObject = Course.create({id: key, title: json[key].title});
        coursesArray.push(protobufObject);
    });

    const response = ServerCourseResponse.create({courses: coursesArray});
    // Encode a message to an Uint8Array (browser) or Buffer (node)
    const buffer = ServerCourseResponse.encode(response).finish();
    callback(buffer);
}
