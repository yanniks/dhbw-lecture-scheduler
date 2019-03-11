import * as admin from "firebase-admin";
import {sendNotificationsForCourse} from "./firebase_handling";
import {ILecture} from "./parseLectureSchedule/getDates";

admin.initializeApp({
    credential: admin.credential.cert(require("../../private/firebaseadminsdk.json")),
    databaseURL: "https://dhbw-lecture-scheduler.firebaseio.com",
});

const db = admin.firestore();
const lecturesCollection = db.collection("lectures");
const pushCollection = db.collection("pushTokens");
const requestCollection = db.collection("requests");

interface DatabaseObject {
    createdAt: string;
    lastCheckedForUpdate: string;
    lectures: ILecture[];
}

export interface PublicDatabaseObject {
    createdAt: string;
    lectures: ILecture[];
    useCachedVersion: boolean;
}

interface TokenStore {
    registrations: string[];
}

interface LectureRequest {
    ipAddress: string;
    datetime: string;
}

interface RequestStore {
    [userAgent: string]: LectureRequest[];
}

export async function getCachedLectures(identifier: string): Promise<PublicDatabaseObject | undefined> {
    const doc = lecturesCollection.doc(identifier);
    const lectures = await doc.get();
    if (!lectures.exists) {
        return undefined;
    }
    const data = lectures.data() as DatabaseObject;

    return getPublicDatabaseObject(data);
}

/**
 * Converts Firebase database time objects to ISO Date strings.
 * @param obj
 */
function convertDBTimestampsToISODate<T>(obj: T): T {
    if (Array.isArray(obj)) {
        return obj.map((i) => convertDBTimestampsToISODate(i)) as any;
    }
    for (const key of Object.keys(obj)) {
        const item = (obj as any)[key];
        if (item._seconds !== undefined && item._nanoseconds !== undefined) {
            (obj as any)[key] = new Date(item._seconds * 1000 + item._nanoseconds).toISOString();
        }
    }
    return obj;
}

function getPublicDatabaseObject(lectures: DatabaseObject): PublicDatabaseObject {
    // 6 hours for now
    const maximumLifetime = 6 * 60 * 60 * 1000;

    return {
        createdAt: lectures.createdAt,
        lectures: convertDBTimestampsToISODate(lectures.lectures),
        useCachedVersion: (Date.now() - (new Date(lectures.lastCheckedForUpdate)).getTime()) < maximumLifetime,
    };
}

export async function saveLectures(identifier: string, lectures: ILecture[]): Promise<PublicDatabaseObject> {
    const doc = lecturesCollection.doc(identifier);
    const cachedLectures = await doc.get();
    const currentIsoTime = new Date().toISOString();
    if (cachedLectures.exists) {
        const cachedData = cachedLectures.data() as DatabaseObject;
        if (cachedData.lectures !== lectures) {
            cachedData.createdAt = currentIsoTime;
            cachedData.lectures = lectures;
            sendNotificationsForCourse(identifier);
        }
        cachedData.lastCheckedForUpdate = currentIsoTime;
        await doc.update(cachedData);
        return getPublicDatabaseObject(cachedData);
    }
    const dbObject: DatabaseObject = {
        createdAt: currentIsoTime,
        lastCheckedForUpdate: currentIsoTime,
        lectures,
    };
    sendNotificationsForCourse(identifier);
    await doc.set(dbObject);
    return getPublicDatabaseObject(dbObject);
}

export async function documentRequest(identifier: string, ipAddress: string, userAgent: string) {
    const doc = requestCollection.doc(identifier);
    const requests = await doc.get();
    const escapedUserAgent = userAgent
        .replace(/\+/g, " ")
        .replace(/\./g, "_")
        .replace(/\//g, "_")
        .replace(/\*/g, "_")
        .replace(/~/g, "_")
        .replace(/\[/g, "_")
        .replace(/]/g, "_");
    if (requests.exists) {
        const cachedData = requests.data() as RequestStore;
        if (!cachedData[escapedUserAgent]) {
            cachedData[escapedUserAgent] = [];
        }
        cachedData[escapedUserAgent].push({
            datetime: new Date().toISOString(),
            ipAddress,
        });
        await doc.update(cachedData);
        return;
    }
    const data: RequestStore = {};
    data[escapedUserAgent] = [{
        datetime: new Date().toISOString(),
        ipAddress,
    }];
    await doc.set(data);
}

export async function registerPushToken(identifier: string, token: string) {
    const doc = pushCollection.doc(identifier);
    const tokens = await doc.get();
    if (tokens.exists) {
        const data = tokens.data() as TokenStore;
        data.registrations.push(token);
        await doc.update(data);
        return;
    }
    const tokenStore: TokenStore = {
        registrations: [
            token,
        ],
    };
    await doc.set(tokenStore);
}

export async function getPushTokens(identifier: string): Promise<TokenStore | undefined> {
    const doc = pushCollection.doc(identifier);
    const tokens = await doc.get();
    if (!tokens.exists) {
        return undefined;
    }
    return tokens.data() as TokenStore;
}

export async function deleteStoredPushToken(identifier: string, token: string) {
    const doc = pushCollection.doc(identifier);
    const tokens = await doc.get();
    if (tokens.exists) {
        const data = tokens.data() as TokenStore;
        const index = data.registrations.indexOf(token);
        if (index > -1) {
            data.registrations.splice(index, 1);
        } else {
            return;
        }
        await doc.update(data);
        return;
    }
}
