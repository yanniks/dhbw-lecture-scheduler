import * as express from "express";

const app = express();

import {parseLectures} from "./parseLectureSchedule/parseLectures";
import {generateProtobufCourseList, generateProtobufForCourse} from "./protobuf";

export function createSocket() {
    const jsonCourses = require("../courses.json");

    app.get("/lectures", (req, res) => {
        const data = req.query.course;
        console.log("Received " + data);
        if (jsonCourses[data]) {
            parseLectures(data, (lectures) => {
                if (req.get("Accept") === "application/protobuf") {
                    generateProtobufForCourse(lectures, (protocolBuffer) => {
                        res.type("application/protobuf");
                        res.send(protocolBuffer);
                    });
                } else if (req.get("Accept") === "application/json") {
                    res.type("application/json");
                    res.send(JSON.stringify(lectures));
                } else {
                    res.type("text/calendar");
                    let ical = "BEGIN:VCALENDAR\nVERSION:2.0\n";
                    ical += "X-WR-CALNAME:Vorlesungsplan " + jsonCourses[data].title + "\n";
                    lectures.forEach((event) => {
                        ical += "BEGIN:VEVENT\n";
                        ical += "SUMMARY:" + event.title + "\n";
                        ical += "DTSTART:" + event.begin.replace(/-/g, "").replace(/:/g, "") + "\n";
                        ical += "DTEND:" + event.end.replace(/-/g, "").replace(/:/g, "") + "\n";
                        ical += "LOCATION:" + event.location + "\n";
                        if (event.prof) {
                            ical += "ORGANIZER;CN=\"" + event.prof + "\"";
                        }
                        ical += "STATUS:CONFIRMED\n";
                        ical += "END:VEVENT\n";
                    });
                    ical += "END:VCALENDAR\n";
                    res.send(ical);
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
