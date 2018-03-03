import {JSDOM} from "jsdom";
import {generateDateObject, ILecture} from "./getDates";

export function getFileContent(key: string, callback: any) {
    const date = getNextLectureDate();
    let url = "https://rapla.dhbw-stuttgart.de/rapla?key=" + key;
    // JS months go from 0-11, not 1-12
    url += "&day=" + date.getDate() + "&month=" + (date.getMonth() + 1) + "&year=" + date.getFullYear();
    JSDOM.fromURL(url).then((dom, err) => parseDOM(dom, callback));
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

function parseDOM(dom: any, callback: any) {
    const window = dom.window;
    const $ = require("jquery")(window);
    const links = $("a");
    const lectures = [];
    links.each((i) => {
        const item = links[i];
        const text = item.text;

        const lecture: ILecture = {};

        lecture.title = text.split("Veranstaltungsname:\n")[1].split("\n")[0].trim();

        lecture.location = text.split("Ressourcen:\n")[1].split("\n")[0].trim();

        lecture.prof = [];
        if (text.indexOf("Personen:\n") > -1) {
            const participants = text.split("Personen:\n")[1].split("\n")[0].trim().split(",");

            participants.forEach((participant) => {
                if (participant.trim()) {
                    lecture.prof.push(participant.trim());
                }
            });
        }

        const timeframe = text.split("\n")[1];
        const dateGerman = timeframe.split(" ")[1];
        const time = timeframe.split(" ")[2].substr(0, 11);
        lecture.begin = time.substr(0, 5);
        lecture.end = time.substr(6, 5);

        let date = dateGerman.split(".");
        date = "20" + date.reverse().join("");

        lecture.begin = generateDateObject(date, lecture.begin, false);
        lecture.end = generateDateObject(date, lecture.end, true);
        lectures.push(lecture);
    });

    callback(lectures);
}
