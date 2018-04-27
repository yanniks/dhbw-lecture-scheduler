export function getProf(title: string, course: string): string[] {
    if (!course) {
        console.error("Could not get lecturer for " + title);
        return [];
    }
    try {
        const profs = require("../../lecturers/profs_" + course + ".json");
        const prof = profs[title.trim()];
        if (!Array.isArray(prof)) {
            return prof ? [prof] : [];
        }
        return prof;
    } catch (ex) {
        return [];
    }
}
