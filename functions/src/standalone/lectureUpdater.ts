// Updates all lectures in a periodical event

import {sendNotificationsForCourse} from "./firebase_handling";
import {downloadFile} from "./parseLectureSchedule/fileDownload";

// 30 Minutes
const updateInterval = 1800000;

/*async function updateLectures(course, courseUrl) {
    const data = await downloadFile(courseUrl);
    console.log(data);
}

/*function checkIfUpdateNeeded(filename, course) {
    compareFiles(filename, course, (result) => {
        if (!result) {
            try {
                fs.unlinkSync("tmp/" + course + ".pdf");
            } catch (err) {
                console.error(err);
            }
            try {
                fs.unlinkSync("tmp/" + filename);
            } catch (err) {
                console.error(err);
            }
            mv("tmp/new." + filename, "tmp/" + course + ".pdf", {mkdirp: true}, (err) => {
                if (err) {
                    throw err;
                }
            });
        } else {
            try {
                fs.unlinkSync("tmp/new." + filename);
            } catch (err) {
                console.error(err);
            }
        }
    });
}

function periodicalUpdateJob() {
    const courses = require("../courses.json");
    Object.keys(courses).forEach((course) => {
        updateLectures(course, courses[course].url);
    });
}

function sendUpdatesToAllDevices() {
    // The service might be restarted because of feature improvements.
    // Therefore, let the Android devices pull an update after restart.
    const courses = require("../courses.json");
    Object.keys(courses).forEach((course) => {
        sendNotificationsForCourse(course);
    });
}

export function updateLecturesPeriodically() {
    sendUpdatesToAllDevices();
    periodicalUpdateJob();
}*/
