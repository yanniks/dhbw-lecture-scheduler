import { JSDOM } from "jsdom";
import moment = require("moment");
import { logger } from "../logger";
import { generateDateObject, ILecture } from "./getDates";

interface IRaplaResult {
    courseName?: string;
    lectures: ILecture[];
}

/**
 * Returns the lecture schedule for the current and the next week.
 * @param key Rapla key that is used for communication with the backend.
 */
export async function getFileContent(key: string): Promise<IRaplaResult> {
    const date = getNextLectureDate();
    const nextWeek = new Date(date.getTime());
    nextWeek.setDate(nextWeek.getDate() + 7);
    const weekOne = getLecturesForDate(key, date).catch(catchErrorRetrievingLectures);
    const weekTwo = getLecturesForDate(key, nextWeek).catch(catchErrorRetrievingLectures);
    const res = await Promise.all([weekOne, weekTwo]);
    return {
        courseName: res[0].courseName || res[1].courseName,
        lectures: res[0].lectures.concat(res[1].lectures),
    };
}

/**
 * Called in case the lecture plan could not be retrieved successfully.
 * Returns an empty IRaplaResult object so that the plan can be returned without this specific week.
 * @param e Error thrown by the retrieval function.
 */
async function catchErrorRetrievingLectures(e: Error): Promise<IRaplaResult> {
    logger.error("Retrieving lectures failed.", {e});
    return {
        lectures: [],
    };
}

/**
 * Returns the Rapla lectures for a certain week.
 * @param key Rapla key that is used for communication with the backend.
 * @param date All lectures in the week of this date are returned.
 */
function getLecturesForDate(key: string, date: Date): Promise<IRaplaResult> {
    let url = `https://rapla.dhbw-stuttgart.de/rapla?key=${key}`;
    // JS months go from 0-11, not 1-12
    url += `&day=${date.getDate()}&month=${(date.getMonth() + 1)}&year=${date.getFullYear()}`;
    return JSDOM.fromURL(url).then(parseDOM);
}

function getNextLectureDate(): Date {
    const date = new Date();
    if (date.getDay() === 0) {
        // Sunday, add one day
        date.setDate(date.getDate() + 1);
    } else if (date.getDay() === 6) {
        // Saturday, add two days
        date.setDate(date.getDate() + 2);
    }
    return date;
}

/**
 * Converts the German weekday abbreviation to a number between 1 and 7
 * @param abbreviation German abbreviation
 */
function abbreviationToWeekdayNumber(abbreviation: string): number {
    if (abbreviation === "Mo") {
        return 1;
    }
    if (abbreviation === "Di") {
        return 2;
    }
    if (abbreviation === "Mi") {
        return 3;
    }
    if (abbreviation === "Do") {
        return 4;
    }
    if (abbreviation === "Fr") {
        return 5;
    }
    if (abbreviation === "Sa") {
        return 6;
    }
    if (abbreviation === "So") {
        return 7;
    }
    return -1;
}

/**
 * Gets the corresponding date for a weekday and a certain calendar week
 * @param weekday weekday in numbers, between 1 and 7
 * @param weekDate Date object that matches the calendar week
 */
function getDateOfWeekdayInWeek(weekday: number, weekDate: moment.Moment): moment.Moment {
    if (weekday > 7 || weekday < 1) {
        throw new Error("Weekday may not out of range [1-7]");
    }
    const weekString = weekDate.format("YYYY[W]WW");
    return moment(`${weekString}${weekday}`);
}

async function parseDOM(dom: JSDOM): Promise<IRaplaResult> {
    const window = dom.window;
    const $ = require("jquery")(window);
    const links = $("a");
    const h2 = window.document.querySelector("h2");
    const courseName = h2 !== null ? h2.textContent!.trim() : undefined;

    const selectedDateInDom = moment({
        day: parseInt((window.document.querySelector('select[name="day"]') as any).value, 10),
        month: (parseInt((window.document.querySelector('select[name="month"]') as any).value, 10) - 1),
        year: parseInt((window.document.querySelector('select[name="year"]') as any).value, 10),
    });
    const lectures = Object.values(links).map((item: any) => {
        if (typeof item.text !== "string") {
            return undefined;
        }
        const text = item.text;

        const lecture: ILecture = {};

        lecture.title = text.split("Veranstaltungsname:\n")[1].split("\n")[0].trim();

        lecture.location = text.split("Ressourcen:\n")[1].split("\n")[0].trim();

        lecture.prof = [];
        if (text.indexOf("Personen:\n") > -1) {
            const participant = text.split("Personen:\n")[1].split("\n")[0].trim();

            if (participant.substring(participant.length - 1, participant.length) === ",") {
                lecture.prof.push(participant.substring(0, participant.length - 1));
            } else {
                lecture.prof.push(participant);
            }
        }
        const timeframe = text.split("\n")[1];
        // No german date inside time frame and weekly
        if (timeframe.substr(0, 10).indexOf(".") === -1 && timeframe.indexOf("wöchentlich") > -1) {
            const weekdayNumber = abbreviationToWeekdayNumber(timeframe.substr(0, 2));
            const date = getDateOfWeekdayInWeek(weekdayNumber, selectedDateInDom);
            const time = timeframe.split(" ")[1].substr(0, 11);
            const begin = time.substr(0, 5);
            const end = time.substr(6, 5);
            const dateFormatted = date.format("YYYYMMDD");
            lecture.begin = generateDateObject(dateFormatted, begin, false);
            lecture.end = generateDateObject(dateFormatted, end, true);
        } else {
            const dateGerman = timeframe.split(" ")[1];
            const time = timeframe.split(" ")[2].substr(0, 11);
            const begin = time.substr(0, 5);
            const end = time.substr(6, 5);

            let date = dateGerman.split(".");
            date = "20" + date.reverse().join("");

            lecture.begin = generateDateObject(date, begin, false);
            lecture.end = generateDateObject(date, end, true);
        }
        return lecture;
    }).filter((i) => i !== undefined) as ILecture[];

    return { courseName, lectures };
}
