import {logger} from "../logger";

interface ILecturersObject {
    [lecture: string]: string | string[];
}

export function getProf(title: string, course: string): string[] | undefined {
    if (!course) {
        logger.warn("Lecturer not found", {course, title});
        return undefined;
    }
    try {
        const profs = require(`${__dirname}/../../../lecturers/profs_${course}.json`) as ILecturersObject;
        const prof = profs[title.trim()];
        if (!Array.isArray(prof)) {
            return prof ? [prof] : undefined;
        }
        return prof;
    } catch (ex) {
        return undefined;
    }
}
