import * as moment from "moment-timezone";
import { createDay } from "./createDay";
import { getProf } from "./getProf";

export interface ILecture {
    date?: any;
    begin?: string;
    end?: string;
    prof?: string;
    title?: string;
    location?: string;
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function updateTitle(title) {
    let appointment = title.trim();
    appointment = appointment.replace("IuF", "Investition und Finanzierung");
    return appointment;
}

export function generateDateObject(date, time, end) {
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);
    moment.tz.setDefault("Europe/Berlin");
    const m = moment(year + month + day, "YYYYMMDD");
    if (time) {
        const split = time.split(":");
        const hour = split[0];
        const minute = split[1];
        m.set("hour", hour);
        m.set("minute", minute);
    } else if (end) {
        m.add(1, "day");
    }
    m.tz("UTC");
    return m.format();
}

export function getDates(course, content, callback) {
    const courses = require("../../courses.json");

    createDay(content, (days) => {
        const output = [];
        days.forEach((day) => {
            let date = day[0].split(", ")[1];
            date = date.split(".");
            date = date.reverse().join("");
            day.shift();
            let timeframe = "";
            let appointment = "";
            let loc = "";
            day.forEach((line) => {
                line = line.replace("XXX", "");
                let isDate = false;
                if (line.includes(" - ")) {
                    isDate = true;
                } else {
                    if (line.includes("-")) {
                        const lineexp = line.split(" ");
                        lineexp.forEach((str) => {
                            const strexp = str.split("-");
                            strexp.forEach((part) => {
                                const strtocheck = part.replace(/\./g, "");
                                if (isNumeric(strtocheck) && strtocheck.length === 4) {
                                    isDate = true;
                                }
                            });
                        });
                    }
                    if (!isDate) {
                        const lineexp = line.split(" ");
                        lineexp.forEach((str) => {
                            const strtocheck = str.replace(/\./g, "");
                            if (isNumeric(strtocheck) && strtocheck.length === 4) {
                                isDate = true;
                            }
                        });
                    }
                }
                if (isDate) {
                    if (appointment !== "") {
                        appointment = updateTitle(appointment);
                        const timesplit = timeframe.replace(/\./g, ":").split("-");
                        const ap: ILecture = {date, title: appointment};
                        if (timesplit[0]) {
                            ap.begin = timesplit[0].trim().split(" ")[0];
                        }
                        if (timesplit[1]) {
                            ap.end = timesplit[1].trim();
                        }
                        if (getProf(appointment, course)) {
                            ap.prof = getProf(appointment, course);
                        }
                        if (loc) {
                            ap.location = loc;
                        } else {
                            ap.location = "Raum 4.10";
                        }
                        output.push(ap);
                    }
                    appointment = "";
                    if (line.match("/[a-z]/i")) {
                        const lineexp = line.split(" ");
                        lineexp.forEach((str) => {
                            const strtocheck = str.replace(/\./g, "");
                            if (!isNumeric(strtocheck) && strtocheck.length !== 4) {
                                appointment += str;
                            }
                        });
                    }
                    timeframe = line;
                } else if (line.includes("Raum ") || line.includes("R. ") || line.includes("P50 ")) {
                    loc = line;
                } else if (line !== "" && !line.includes("Woche ")) {
                    if (line[line.length - 1] === "-") {
                        line = line.substr(0, line.length - 1);
                        appointment += line;
                    } else {
                        appointment += line + " ";
                    }
                }
            });
            if (appointment !== "") {
                appointment = updateTitle(appointment);
                const timesplit = timeframe.replace(/\./g, ":").split("-");
                const ap: ILecture = {date, title: appointment};
                if (timesplit[0]) {
                    ap.begin = timesplit[0].trim().split(" ")[0];
                }
                if (timesplit[1]) {
                    ap.end = timesplit[1].trim();
                }
                if (getProf(appointment, course)) {
                    ap.prof = getProf(appointment, course);
                }
                if (loc) {
                    ap.location = loc;
                } else {
                    ap.location = courses[course].room;
                }
                output.push(ap);
            }
        });

        output.forEach((item) => {
            item.begin = generateDateObject(item.date, item.begin, false);
            item.end = generateDateObject(item.date, item.end, true);
            delete item.date;
        });
        callback(output);
    });
}
