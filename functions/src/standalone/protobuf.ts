import {ILecture} from "./parseLectureSchedule/getDates";
import * as proto from "./protos/protos";
import {ICourses} from "./socket";

export async function generateProtobufForCourse(json: ILecture[]): Promise<Buffer> {

    // Obtain a message type
    const Lecture = proto.dhbw.servercommunication.Lecture;
    const ServerLectureResponse = proto.dhbw.servercommunication.ServerLectureResponse;

    // Create a new message
    const lecturesArray: any[] = [];
    json.forEach((lect) => {
        const lecture: any = lect;
        lecture.prof = lect.prof!.join(", ");
        const protobufObject = Lecture.create(lecture);
        lecturesArray.push(protobufObject);
    });

    const response = ServerLectureResponse.create(({lectures: lecturesArray} as any));
    // Encode a message to an Uint8Array (browser) or Buffer (node)
    return ServerLectureResponse.encode(response);
}

export async function generateProtobufCourseList(json: ICourses): Promise<Buffer> {
    // Obtain a message type
    const Course = proto.dhbw.servercommunication.Course;
    const ServerCourseResponse = proto.dhbw.servercommunication.ServerCourseResponse;

    // Create a new message

    const coursesArray: any[] = [];
    Object.keys(json).forEach((key) => {
        const protobufObject = Course.create({id: key, title: json[key as any].title} as any);
        coursesArray.push(protobufObject);
    });

    const response = ServerCourseResponse.create({courses: coursesArray} as any);
    // Encode a message to an Uint8Array (browser) or Buffer (node)
    return ServerCourseResponse.encode(response);
}
