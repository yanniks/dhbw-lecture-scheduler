import * as express from "express";

const app = express();

import {generateIcal} from "./ical_support";
import {parseLectures} from "./parseLectureSchedule/parseLectures";
import {generateProtobufCourseList, generateProtobufForCourse} from "./protobuf";

export function createSocket() {
    const jsonCourses = require("../courses.json");

    app.get("/lectures", (req, res) => {
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
    });
    app.get("/courses", (req, res) => {
        if (req.get("Accept") === "application/protobuf") {
            generateProtobufCourseList(jsonCourses, (protocolBuffer) => {
                res.type("application/protobuf");
                res.send(protocolBuffer);
            });
        } else {
            res.type("application/json");
            res.send(JSON.stringify(jsonCourses));
        }
    });
    app.listen(process.env.PORT || 3000, () => {
        console.log("dhbw-lecture-scheduler listening on port " + (process.env.PORT || 3000) + "!");
    });
}
