export function generateIcal(lectures: any, courseTitle: string, res: any) {
    res.type("text/calendar");
    let ical = "BEGIN:VCALENDAR\nVERSION:2.0\n";
    ical += "X-WR-CALNAME:Vorlesungsplan " + courseTitle + "\n";
    lectures.forEach((event) => {
        ical += "BEGIN:VEVENT\n";
        ical += "SUMMARY:" + event.title + "\n";
        const begin = event.begin.replace(/-/g, "").replace(/:/g, "") + "\n";
        const end = event.end.replace(/-/g, "").replace(/:/g, "") + "\n";
        if (begin.substring(8, 16) === "T220000Z" && end.substring(8, 16) === "T220000Z") {
            // Seems like a whole-day event
            ical += "DTSTART;VALUE=DATE:" + begin.substring(0, 8) + "\n";
            ical += "DTEND;VALUE=DATE:" + begin.substring(0, 8) + "\n";
        } else {
            ical += "DTSTART:" + begin;
            ical += "DTEND:" + end;
        }
        ical += "LOCATION:" + event.location + "\n";
        if (event.prof) {
            ical += "ORGANIZER;CN=\"" + event.prof + "\"\n";
        }
        ical += "STATUS:CONFIRMED\n";
        ical += "END:VEVENT\n";
    });
    ical += "END:VCALENDAR\n";
    res.send(ical);
}
