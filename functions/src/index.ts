import * as cors from "cors";
import * as express from "express";
import * as functions from "firebase-functions";
import {INPMPackage} from "./standalone/package-json";
import {deletePushToken, sendCourseList, sendLectures} from "./standalone/socket";

export const isGoogleCloud = false;
const corsMiddleware = cors({
    origin: true,
});

const lecturesApp = express();

function getPackageJson(): INPMPackage {
    return require(`${__dirname}/../../package.json`);
}

lecturesApp.use((req, res, next) => {
    if (req.get("X-Request-Server-Version")) {
        res.set({
            "X-DHBW-Server-Version": getPackageJson().version,
        });
    }
    next();
});

lecturesApp.get("/lectures", (req, res) => sendLectures(req.query.course, req, res));
lecturesApp.delete("/lectures/:course", deletePushToken);
lecturesApp.get("/lectures/:course", (req, res) => sendLectures(req.params.course, req, res));
lecturesApp.get("*", (req, res) => sendLectures(req.query.course, req, res));
// lecturesApp.listen(5000, "0.0.0.0");
exports.lectures = functions.https.onRequest(lecturesApp);
exports.courses = functions.https.onRequest((req, res) => {
    corsMiddleware(req, res, async () => {
        await sendCourseList(req, res);
    });
});
