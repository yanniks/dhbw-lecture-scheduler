import * as express from "express";

const app = express();

import {generateIcal} from "./ical_support";
import {parseLectures} from "./parseLectureSchedule/parseLectures";
import {generateProtobufCourseList, generateProtobufForCourse} from "./protobuf";

function sendLectures(req, res) {
    const jsonCourses = require("../courses.json");

    const course = req.query.course;
    const key = req.query.key;

    console.log("Received " + course);
    if (jsonCourses[course] || key) {
        parseLectures(course, key, (lectures) => {
            if (req.get("Accept") === "application/protobuf") {
                generateProtobufForCourse(lectures, (protocolBuffer) => {
                    res.type("application/protobuf");
                    res.send(protocolBuffer);
                });
            } else if (req.get("Accept") === "application/json") {
                res.type("application/json");
                res.send(JSON.stringify(lectures));
            } else {
                generateIcal(lectures, jsonCourses[course] ? jsonCourses[course].title : "", res);
            }
        });
        return;
    }
    res.type("application/json");
    res.send(JSON.stringify({error: "Course not supported."}));
}

function sendCourseList(req, res) {
    const jsonCourses = require("../courses.json");

    if (req.get("Accept") === "application/protobuf") {
        generateProtobufCourseList(jsonCourses, (protocolBuffer) => {
            res.type("application/protobuf");
            res.send(protocolBuffer);
        });
    } else {
        res.type("application/json");
        res.send(JSON.stringify(jsonCourses));
    }
}

export function createSocket() {
    app.get("/lectures", sendLectures);
    app.get("/courses", sendCourseList);
    app.listen(process.env.PORT || 3000, () => {
        console.log("dhbw-lecture-scheduler listening on port " + (process.env.PORT || 3000) + "!");
    });
}
