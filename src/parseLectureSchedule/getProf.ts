export function getProf(title, course) {
    if (!course) {
        console.log(title);
        return null;
    }
    try {
        const profs = require("../lecturers/profs_" + course + ".json");
        return profs[title.trim()];
    } catch (ex) {
        return null;
    }
}
