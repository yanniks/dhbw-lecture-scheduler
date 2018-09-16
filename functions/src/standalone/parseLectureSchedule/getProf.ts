import {logger} from "../logger";

export function getProf(title: string, course: string): string[] | undefined {
    if (!course) {
        logger.warn("Lecturer not found", {course, title});
        return undefined;
    }
    try {
        const profs = require("../../lecturers/profs_" + course + ".json");
        const prof = profs[title.trim()];
        if (!Array.isArray(prof)) {
            return prof ? [prof] : undefined;
        }
        return prof;
    } catch (ex) {
        return undefined;
    }
}
