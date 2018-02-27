export function getProf(title, course) {
    if (!course) {
        console.error("Could not get lecturer for " + title);
        return null;
    }
    try {
        const profs = require("../../lecturers/profs_" + course + ".json");
        return profs[title.trim()];
    } catch (ex) {
        return null;
    }
}
