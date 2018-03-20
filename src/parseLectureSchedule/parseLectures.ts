import * as fs from "fs";
import * as util from "util";
import {getDates} from "./getDates";
import {getFileContent} from "./rapla_course_supprt";

export function parseLectures(course: string, key: string, lang: string, callback: any) {
    if (key) {
        getFileContent(key, callback);
        return;
    }
    fs.readFile("tmp/" + course + ".csv", (err, data) => {
        getDates(course, data.toString(), lang, (schedule) => {
            callback(schedule);
        });
    });
}

export function lastUpdatedDate(course: string, callback: any) {
    if (!course) {
        return callback(null);
    }
    fs.stat("tmp/" + course + ".csv", (err, stats) => {
        if (err) {
            return callback(null);
        }
        const mtime = new Date(util.inspect(stats.mtime));
        callback(mtime);
    });
}
