import * as cors from "cors";
import * as express from "express";
import * as functions from "firebase-functions";
import {deletePushToken, sendCourseList, sendLectures} from "./standalone/socket";

const corsMiddleware = cors({
    origin: true,
});

const lecturesApp = express();

lecturesApp.get("/lectures", (req, res) => sendLectures(req.query.course, req, res));
lecturesApp.delete("/lectures/:course", deletePushToken);
lecturesApp.get("/lectures/:course", (req, res) => sendLectures(req.params.course, req, res));

exports.lectures = functions.https.onRequest(lecturesApp);
exports.courses = functions.https.onRequest((req, res) => {
    corsMiddleware(req, res, async () => {
        await sendCourseList(req, res);
    });
});
