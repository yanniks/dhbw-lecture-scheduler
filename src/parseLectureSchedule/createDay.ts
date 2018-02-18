import * as csv from "csv";

function parseCsv(l, i, lin, callback) {
    if (l.length <= i) {
        callback(lin);
        return;
    }
    const li = l[i];
    csv.parse(li, (err, line) => {
        if (line) {
            lin.push(line[0]);
        }
        parseCsv(l, i + 1, lin, callback);
    });
}

function dayLineArray(dayarrays, i, dlin, callback) {
    if (dayarrays.length <= i) {
        callback(dlin);
        return;
    }
    const days = dayarrays[i];
    const l = days.split("\n");
    const lin = [];
    parseCsv(l, 0, lin, (line) => {
        dlin.push(line);
        dayLineArray(dayarrays, i + 1, dlin, callback);
    });
}

export function createDay(content, callback) {
    const rows = content.split("\n");
    const dayarrays = [];
    let lines = "";
    let weitere = false;
    let first = true;
    let lastrow = "";
    rows.forEach((row) => {
        if (row.includes("Montag") || row.includes("Dienstag") || row.includes("Mittwoch") ||
            row.includes("Donnerstag") || row.includes("Freitag")) {
            if (first) {
                first = !first;
            } else {
                dayarrays.push(lines);
            }
            lines = "";
        }
        if (row.includes("weitere Termine:")) {
            weitere = true;
        }
        if (!weitere) {
            lines += row + "\n";
        }
        lastrow = row;
    });
    dayarrays.push(lines);
    dayarrays.push(lastrow);
    dayLineArray(dayarrays, 0, [], (dlin) => {
        const diffcourses = [];
        dlin.forEach((item) => {
            if (item[0]) {
                for (let i = 0; i < item[0].length; i++) {
                    const aout = [];
                    item.forEach((row1) => {
                        if (row1) {
                            aout.push(row1[i]);
                        }
                    });
                    diffcourses.push(aout);
                }
            }
        });
        callback(diffcourses);
    });
}
