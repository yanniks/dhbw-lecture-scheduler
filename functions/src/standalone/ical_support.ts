import {Response} from "firebase-functions";
import moment = require("moment");
import {ILecture, isMidnight} from "./parseLectureSchedule/getDates";

// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
function hashCode(str: string) {
    return str.split("").reduce((prevHash, currVal) =>
        ((prevHash << 5) - prevHash) + currVal.charCodeAt(0), 0);
}

function formatDateForICal(date: Date): string {
    return moment(date).utc().format("YYYYMMDDTHHmmss[Z]");
}

export function generateIcal(dateChanged: Date, lectures: ILecture[], courseTitle: string, res: Response) {
    res.type("text/calendar");

    const dtstamp = formatDateForICal(dateChanged);

    let ical = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\n";
    ical += "PRODID:-//Yannik Ehlert//LectureSchedule" + courseTitle + "\r\n";
    ical += "X-WR-CALNAME:Vorlesungsplan " + courseTitle + "\r\n";
    lectures.forEach((event) => {
        ical += "BEGIN:VEVENT\r\n";
        ical += "SUMMARY:" + event.title + "\r\n";
        const begin = formatDateForICal(event.begin!) + "\r\n";
        const end = formatDateForICal(event.end!) + "\r\n";
        if (isMidnight(event.begin!) && isMidnight(event.end!)) {
            // Seems like a whole-day event
            ical += "DTSTART;VALUE=DATE:" + end.substring(0, 8) + "\r\n";
            ical += "DTEND;VALUE=DATE:" + end.substring(0, 8) + "\r\n";
        } else {
            ical += "DTSTART:" + begin;
            ical += "DTEND:" + end;
        }
        ical += "DTSTAMP:" + dtstamp + "\r\n";
        if (event.location) {
            ical += "LOCATION:" + event.location.replace(/,/g, "\\,") + "\r\n";
        }
        (event.prof || []).forEach((lecturer) => {
            ical += "ATTENDEE;CUTYPE=INDIVIDUAL\r\n ;PARTSTAT=ACCEPTED\r\n ;ROLE=CHAIR\r\n ;CN="
                + lecturer + ":X-PID:" + hashCode(lecturer.split(" ").join("").toLowerCase())
                + "\r\n";
        });
        ical += "UID:" + hashCode(begin + end) + "\r\n";
        ical += "STATUS:CONFIRMED\r\n";
        ical += "END:VEVENT\r\n";
    });
    ical += "END:VCALENDAR\r\n";
    res.send(ical);
}
