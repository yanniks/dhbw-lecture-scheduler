import * as moment from "moment-timezone";
import {getCourses, ICourseDetails} from "../socket";
import {createDay} from "./createDay";
import {getProf} from "./getProf";

export interface ILecture {
    date?: string;
    begin?: string;
    end?: string;
    prof?: string[];
    title?: string;
    location?: string;
}

function isNumeric(n: any): boolean {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function updateTitle(title: string): string {
    let appointment = title.trim();
    appointment = appointment.replace("IuF", "Investition und Finanzierung");
    return appointment;
}

function getRoomLocalized(lang: string): string {
    if (lang.substring(0, 2) === "de") {
        return "Raum ";
    } else {
        return "Room ";
    }
}

function getDefaultLocation(course: ICourseDetails, lang: string) {
    let room = getRoomLocalized(lang);
    room += course.room;
    if (course.address) {
        return room + ", " + course.address;
    }
    return room;
}

export function generateDateObject(date: string, time?: string, end?: boolean): string {
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);
    moment.tz.setDefault("Europe/Berlin");
    const m = moment(year + month + day, "YYYYMMDD");
    if (time) {
        const split = time.split(":");
        const hour = parseInt(split[0], 10);
        const minute = parseInt(split[1], 10);
        m.set("hour", hour);
        m.set("minute", minute);
    } else if (end) {
        m.add(1, "day");
    }
    m.tz("UTC");
    return m.format();
}

export function isMidnight(date: string): boolean {
    const m = moment(date);
    m.tz("Europe/Berlin");
    return m.get("hour") === 0 && m.get("minute") === 0;
}

export async function getDates(courseName: string, courseData: Buffer, lang: string): Promise<ILecture[]> {
    const courses = getCourses();
    const defaultRoom = getDefaultLocation(courses[courseName], lang);

    const days = await createDay(courseData);
    const output: ILecture[] = [];
    days.forEach((day) => {
        const dateArray = day[0].split(", ")[1].split(".");
        const date = dateArray.reverse().join("");
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
                    if (getProf(appointment, courseName)) {
                        ap.prof = getProf(appointment, courseName);
                    }
                    if (loc) {
                        ap.location = loc;
                    } else {
                        ap.location = defaultRoom;
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
            } else {
                appointment += lineToAppointmentTitle(line);
                loc = getLocationFromLine(lang, line) || loc;
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
            if (getProf(appointment, courseName)) {
                ap.prof = getProf(appointment, courseName);
            }
            if (loc) {
                ap.location = loc;
            } else if (ap.begin) {
                ap.location = defaultRoom;
            }
            output.push(ap);
        }
    });

    output.forEach((item) => {
        item.begin = generateDateObject(item.date!, item.begin, false);
        item.end = generateDateObject(item.date!, item.end, true);
        delete item.date;
    });
    return output;
}

function lineToAppointmentTitle(line: string): string {
    if (line !== "" && line.indexOf("Woche ") === -1) {
        if (line[line.length - 1] === "-") {
            line = line.substr(0, line.length - 1)
                .replace(/\S*Raum?(.*)\S*/, "")
                .replace(/\S*P50?(.*)\S*/, "")
                .replace(/\S*R\..*\S*/, "").trim();
            return line;
        } else {
            return line
                .replace(/\S*Raum?(.*)\S*/, "")
                .replace(/\S*P50?(.*)\S*/, "")
                .replace(/\S*R\..*\S*/, "").trim() + " ";
        }
    }
    return "";
}

function getLocationFromLine(lang: string, line: string): string | undefined {
    if (line.indexOf("Raum") > -1) {
        let roomInfo = line.split("Raum")[1].trim();
        if (roomInfo.substring(0, 1) === ":") {
            roomInfo = roomInfo.substring(1, roomInfo.length);
        }
        return getRoomLocalized(lang) + roomInfo.trim();
    }
    if (line.indexOf("R. ") > -1) {
        return getRoomLocalized(lang) + line.split("R. ")[1].trim();
    }
    if (line.indexOf("P50") > -1) {
        return "P50" + line.split("P50")[1];
    }
    return undefined;
}
