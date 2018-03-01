export function getProf(title, course): string[] {
    if (!course) {
        console.error("Could not get lecturer for " + title);
        return null;
    }
    try {
        const profs = require("../../lecturers/profs_" + course + ".json");
        const prof = profs[title.trim()];
        if (!Array.isArray(prof)) {
            return prof ? [prof] : [];
        }
        return prof;
    } catch (ex) {
        return null;
    }
}
