import {JSDOM} from "jsdom";
import {generateDateObject, ILecture} from "./getDates";

export function getFileContent(key: string): Promise<ILecture[]> {
    const date = getNextLectureDate();
    let url = "https://rapla.dhbw-stuttgart.de/rapla?key=" + key;
    // JS months go from 0-11, not 1-12
    url += "&day=" + date.getDate() + "&month=" + (date.getMonth() + 1) + "&year=" + date.getFullYear();
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

async function parseDOM(dom: any): Promise<ILecture[]> {
    const window = dom.window;
    const $ = require("jquery")(window);
    const links = $("a");
    const lectures: ILecture[] = [];
    links.each((i: any) => {
        const item = links[i];
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
        const dateGerman = timeframe.split(" ")[1];
        const time = timeframe.split(" ")[2].substr(0, 11);
        const begin = time.substr(0, 5);
        const end = time.substr(6, 5);

        let date = dateGerman.split(".");
        date = "20" + date.reverse().join("");

        lecture.begin = generateDateObject(date, begin, false);
        lecture.end = generateDateObject(date, end, true);
        lectures.push(lecture);
    });

    return lectures;
}
