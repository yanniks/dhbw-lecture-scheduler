import * as fs from "fs";
import { getDates } from "./getDates";
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
