import * as express from "express";

const app = express();

import {deleteStoredPushToken, documentRequest, registerPushToken} from "./database_support";
import {generateIcal} from "./ical_support";
import {parseLectures} from "./parseLectureSchedule/parseLectures";
import {generateProtobufCourseList, generateProtobufForCourse} from "./protobuf";

function sendLectures(course, req, res) {
    const jsonCourses = require("../courses.json");

    const key = req.query.key;

    if (req.headers["x-push-token"]) {
        const pushToken = req.headers["x-push-token"];
        registerPushToken(key || course, pushToken);
    }

    if (jsonCourses[course] || key) {
        parseLectures(course, key, req.headers["accept-language"] || "de-de", (lectures) => {
            documentRequest(key || course, req.headers["x-forwarded-for"], req.headers["user-agent"]);
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

function deletePushToken(req, res) {
    if (req.headers["x-push-token"]) {
        const pushToken = req.headers["x-push-token"];
        deleteStoredPushToken(req.params.course, pushToken);
    }
    res.type("application/json");
    res.send(JSON.stringify({success: true}));
}

export function createSocket() {
    app.use(express.static("ui"));
    app.get("/lectures", (req, res) => sendLectures(req.query.course, req, res));
    app.delete("/lectures/:course", deletePushToken);
    app.get("/lectures/:course", (req, res) => sendLectures(req.params.course, req, res));
    app.get("/courses", sendCourseList);
    app.listen(process.env.PORT || 3000, () => {
        console.info("dhbw-lecture-scheduler listening on port " + (process.env.PORT || 3000) + "!");
    });
}
