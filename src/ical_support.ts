export function generateIcal(lectures: any, courseTitle: string, res: any) {
    res.type("text/calendar");
    let ical = "BEGIN:VCALENDAR\nVERSION:2.0\n";
    ical += "X-WR-CALNAME:Vorlesungsplan " + courseTitle + "\n";
    lectures.forEach((event) => {
        ical += "BEGIN:VEVENT\n";
        ical += "SUMMARY:" + event.title + "\n";
        ical += "DTSTART:" + event.begin.replace(/-/g, "").replace(/:/g, "") + "\n";
        ical += "DTEND:" + event.end.replace(/-/g, "").replace(/:/g, "") + "\n";
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
