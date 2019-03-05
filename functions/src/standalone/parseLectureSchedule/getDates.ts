import * as moment from "moment-timezone";
import {getCourses, ICourseDetails} from "../socket";
import {convertPdfToDays} from "./createDay";
import {getProf} from "./getProf";

export interface ILecture {
    begin?: Date;
    end?: Date;
    prof?: string[];
    title?: string;
    location?: string;
}

function isNumeric(n: any): boolean {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function updateTitle(title: string): string {
    return title.trim()
        .replace(/^Uhr\S*/g, "").trim()
        .replace("IuF", "Investition und Finanzierung")
        .replace("EDI", "Electronic Data Interchange")
        .replace(/^DW/g, "Data Warehouse")
        .replace("Ind.", "Industrie")
        .replace(/^ITIL/g, "IT Infrastructure Library");
}

function getRoomLocalized(lang: string): string {
    if (lang.substring(0, 2) === "de") {
        return "Raum ";
    } else {
        return "Room ";
    }
}

function addHoursToDate(date: Date, hours: number): Date {
    const m = moment(date);
    m.add(hours, "hours");
    return m.toDate();
}

function getDefaultLocation(course: ICourseDetails, lang: string) {
    let room = getRoomLocalized(lang);
    room += course.room;
    if (course.address) {
        return room + ", " + course.address;
    }
    return room;
}

export function generateDateObject(date: string, time?: string, end?: boolean): Date {
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
    return m.toDate();
}

export function isMidnight(date: Date): boolean {
    const m = moment(date);
    m.tz("Europe/Berlin");
    return m.get("hour") === 0 && m.get("minute") === 0;
}

function lineContainsDateTimeInformation(line: string): boolean {
    if (line.includes(" - ")) {
        return true;
    } else {
        const lineexp = line.split(" ");
        if (line.includes("-")) {
            for (const str of lineexp) {
                const strexp = str.split("-");
                for (const part of strexp) {
                    const strtocheck = part.replace(/\./g, "");
                    if (isNumeric(strtocheck) && strtocheck.length === 4) {
                        return true;
                    }
                }
            }
        }
        if (lineexp.length > 0) {
            const strtocheck = lineexp[0].replace(/\./g, "");
            if (isNumeric(strtocheck) && strtocheck.length === 4) {
                return true;
            }
        }
    }
    return false;
}

interface ILecturePreparationInformation {
    appointment?: string;
    courseName: string;
    date: string;
    defaultRoom: string;
    location?: string;
    timeframe?: string;
}

function generateLectureObject(information: ILecturePreparationInformation): ILecture {
    const appointment = updateTitle(information.appointment!);
    const lecture: ILecture = {title: appointment};
    if (information.timeframe) {
        const timesplit = information.timeframe!.replace(/\./g, ":").split("-");
        if (timesplit[0]) {
            const begin = timesplit[0].trim().split(" ")[0];
            lecture.begin = generateDateObject(information.date!, begin, false);
        }
        if (timesplit[1]) {
            const end = timesplit[1].trim();
            lecture.end = generateDateObject(information.date!, end, true);
        } else if (lecture.begin) {
            // If there is no end time, let's add one hour to the beginning.
            lecture.end = addHoursToDate(lecture.begin, 1);
        }
    } else {
        lecture.begin = generateDateObject(information.date!, undefined, false);
        lecture.end = generateDateObject(information.date!, undefined, true);
    }
    const prof = getProf(appointment, information.courseName);
    if (prof) {
        lecture.prof = prof;
    }
    lecture.location = information.location || information.defaultRoom;
    return lecture;
}

function removeTimeframeFromString(line: string): string | undefined {
    const withoutFirstTimeRange = line.substring(line.indexOf("-") + 1, line.length).trim();
    const positionOfHourMinuteSeparator = withoutFirstTimeRange.search(/[:\.]/g);
    const withoutTimeInformation =
        withoutFirstTimeRange.substring(positionOfHourMinuteSeparator + 3, withoutFirstTimeRange.length);
    return withoutTimeInformation
        .replace(/^[ \/]/g, "")
        .trim();
}

export async function getDates(courseName: string, courseData: Buffer, lang: string): Promise<ILecture[]> {
    const courses = getCourses();
    const defaultRoom = getDefaultLocation(courses[courseName], lang);

    const days = await convertPdfToDays(courseData);
    const output: ILecture[] = [];
    for (const day of days) {
        const dateArray = day[0].split(", ")[1].split(".");
        const date = dateArray.reverse().join("");
        day.shift();

        const preparationInformation: ILecturePreparationInformation = {
            courseName,
            date,
            defaultRoom,
        };

        for (let line of day) {
            line = line.replace(/XXX/g, "").replace(/xxx/g, "").trim();
            const isDate = lineContainsDateTimeInformation(line);

            if (isDate) {
                if (preparationInformation.appointment) {
                    output.push(generateLectureObject(preparationInformation));
                }
                preparationInformation.appointment = "";
                if (line.match(/[a-z]/g)) {
                    preparationInformation.appointment += removeTimeframeFromString(line) + " ";
                }
                preparationInformation.timeframe = line;
            } else {
                preparationInformation.appointment =
                    (preparationInformation.appointment || "") + lineToAppointmentTitle(line);
                preparationInformation.location = getLocationFromLine(lang, line) || preparationInformation.location;
            }
        }
        if (preparationInformation.appointment) {
            output.push(generateLectureObject(preparationInformation));
        }
    }
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
