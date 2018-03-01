import * as express from "express";

const app = express();

import {generateIcal} from "./ical_support";
import {parseLectures} from "./parseLectureSchedule/parseLectures";
import {generateProtobufCourseList, generateProtobufForCourse} from "./protobuf";

function sendLectures(course, req, res) {
    const jsonCourses = require("../courses.json");

    const key = req.query.key;

    console.log(req.headers);
    console.info("Received " + (key || course));
    if (jsonCourses[course] || key) {
        parseLectures(course, key, req.headers["accept-language"] || "de-de", (lectures) => {
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
    app.use(express.static("ui"));
    app.get("/lectures", (req, res) => sendLectures(req.query.course, req, res));
    app.get("/lectures/:course", (req, res) => sendLectures(req.params.course, req, res));
    app.get("/courses", sendCourseList);
    app.listen(process.env.PORT || 3000, () => {
        console.info("dhbw-lecture-scheduler listening on port " + (process.env.PORT || 3000) + "!");
    });
}
