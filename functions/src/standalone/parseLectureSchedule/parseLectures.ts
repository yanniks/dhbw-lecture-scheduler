import {getCachedLectures, PublicDatabaseObject, saveLectures} from "../database_support";
import {getCourses} from "../socket";
import {downloadFile} from "./fileDownload";
import {getDates} from "./getDates";
import {getFileContent} from "./rapla_course_supprt";

export async function parseLectures(course: string, key: string, lang: string): Promise<PublicDatabaseObject> {
    const lectures = await getCachedLectures(key || course);
    if (lectures && lectures.useCachedVersion) {
        return lectures;
    }
    if (key) {
        const raplaDates = await getFileContent(key);
        return saveLectures(key, raplaDates);
    }
    const courseUrl = getUrlForCourse(course);
    if (!courseUrl) {
        return Promise.reject("Course not supported!");
    }
    const data = await downloadFile(courseUrl);
    const dates = await getDates(course, data, lang);
    return saveLectures(course, dates);
}

function getUrlForCourse(course: string): string | undefined {
    const courses = getCourses();
    return courses[course].url;
}
