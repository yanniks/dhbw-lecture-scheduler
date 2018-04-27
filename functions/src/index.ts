import * as express from "express";
import * as functions from "firebase-functions";
import {deletePushToken, sendCourseList, sendLectures} from "./standalone/socket";

const lecturesApp = express();

lecturesApp.get("/", (req, res) => sendLectures(req.query.course, req, res));
lecturesApp.delete("/:course", deletePushToken);
lecturesApp.get("/:course", (req, res) => sendLectures(req.params.course, req, res));

exports.lectures = functions.https.onRequest(lecturesApp);
exports.courses = functions.https.onRequest((req, res) => sendCourseList(req, res));
