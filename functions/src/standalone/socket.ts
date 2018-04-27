import * as admin from "firebase-admin";

admin.initializeApp({
    credential: admin.credential.cert(require("../../private/firebaseadminsdk.json")),
    databaseURL: "https://dhbw-lecture-scheduler.firebaseio.com",
});

export interface ICourseDetails {
    address: string;
    title: string;
    room: string;
    url: string;
}

export interface ICourses {
    [key: string]: ICourseDetails;
}


import {Request, Response} from "firebase-functions";
import {deleteStoredPushToken, documentRequest, registerPushToken} from "./database_support";
import {generateIcal} from "./ical_support";
import {parseLectures} from "./parseLectureSchedule/parseLectures";
import {generateProtobufCourseList, generateProtobufForCourse} from "./protobuf";


export function getCourses(): ICourses {
    return require(__dirname + "/../../courses.json");
}

export async function sendLectures(course: string, req: Request, res: Response) {
    const jsonCourses = getCourses();

    const key = req.query.key;

    if (req.headers["x-push-token"]) {
        const pushToken = req.headers["x-push-token"]!.toString();
        registerPushToken(key || course, pushToken);
    }

    if (jsonCourses[course] || key) {
        const lectures = await parseLectures(course, key, (req.headers["accept-language"] || "de-de").toString());
        documentRequest(key || course, (req.headers["x-forwarded-for"] || "").toString(),
            (req.headers["user-agent"] || "").toString());
        if (req.get("Accept") === "application/protobuf") {
            const protocolBuffer = await generateProtobufForCourse(lectures.lectures);
            res.type("application/protobuf");
            res.send(protocolBuffer);
        } else if (req.get("Accept") === "application/json") {
            res.type("application/json");
            res.send(JSON.stringify(lectures));
        } else {
            const dateChanged = new Date(lectures.createdAt);
            generateIcal(dateChanged, lectures.lectures, jsonCourses[course] ? jsonCourses[course].title : "", res);
        }
        return;
    }
    res.type("application/json");
    res.send(JSON.stringify({error: "Course not supported."}));
}

export async function sendCourseList(req: Request, res: Response) {
    const jsonCourses = getCourses();

    if (req.get("Accept") === "application/protobuf") {
        const protocolBuffer = await generateProtobufCourseList(jsonCourses);
        res.type("application/protobuf");
        res.send(protocolBuffer);
    } else {
        res.type("application/json");
        res.send(JSON.stringify(jsonCourses));
    }
}

export function deletePushToken(req: Request, res: Response) {
    if (req.headers["x-push-token"]) {
        const pushToken = req.headers["x-push-token"];
        deleteStoredPushToken(req.params.course, pushToken as any);
    }
    res.type("application/json");
    res.send(JSON.stringify({success: true}));
}
