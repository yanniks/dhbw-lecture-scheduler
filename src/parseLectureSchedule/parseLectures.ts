import * as fs from "fs";
import { getDates } from "./getDates";

export function parseLectures(course, callback) {
    fs.readFile("tmp/" + course + ".csv", (err, data) => {
        getDates(course, data.toString(), (schedule) => {
            callback(schedule);
        });
    });
}
