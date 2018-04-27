import {DatabaseObject, getCachedLectures, saveLectures} from "../database_support";
import {getCourses} from "../socket";
import {downloadFile} from "./fileDownload";
import {getDates} from "./getDates";
import {getFileContent} from "./rapla_course_supprt";

export async function parseLectures(course: string, key: string, lang: string): Promise<DatabaseObject> {
    const lectures = await getCachedLectures(key || course);
    if (lectures) {
        return lectures;
    }
    if (key) {
        const raplaDates = await getFileContent(key);
        return await saveLectures(key, raplaDates);
    }
    const courseUrl = getUrlForCourse(course);
    if (!courseUrl) {
        return Promise.reject("Course not supported!");
    }
    const data = await downloadFile(courseUrl);
    const dates = await getDates(course, data, lang);
    return await saveLectures(course, dates);
}

function getUrlForCourse(course: string): string | undefined {
    const courses = getCourses();
    return courses[course].url;
}
