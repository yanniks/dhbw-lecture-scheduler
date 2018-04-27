import * as admin from "firebase-admin";
import {ILecture} from "./parseLectureSchedule/getDates";

const db = admin.firestore();
const lecturesCollection = db.collection("lectures");

export interface DatabaseObject {
    createdAt: string;
    lectures: ILecture[];
}

export async function getCachedLectures(identifier: string): Promise<DatabaseObject | undefined> {
    const doc = lecturesCollection.doc(identifier);
    const lectures = await doc.get();
    if (!lectures.exists) {
        return undefined;
    }
    const data = lectures.data() as DatabaseObject;

    // 6 hours for now
    const maximumLifetime = 6 * 60 * 60 * 1000;

    if ((Date.now() - (new Date(data.createdAt)).getTime()) > maximumLifetime) {
        await doc.delete();
        return undefined;
    }
    return lectures.data() as DatabaseObject;
}

export async function saveLectures(identifier: string, lectures: ILecture[]): Promise<DatabaseObject> {
    const doc = lecturesCollection.doc(identifier);
    const dbObject: DatabaseObject = {
        createdAt: new Date().toISOString(),
        lectures,
    };
    await doc.set(dbObject);
    return dbObject;
}

export function documentRequest(identifier: string, ipAddress: string, userAgent: string) {
    // LectureRequest.create({ipAddress, requestIdentifier: identifier, userAgent});
}

export function unregisterToken(token: string) {
    /*PushToken.findOne({token}).then((pushToken) => {
        pushToken.destroy();
    });*/
}

export function registerPushToken(identifier: string, token: string) {
    // PushToken.findOrCreate({where: {requestIdentifier: identifier, token}});
}

export function getPushTokens(identifier: string, callback: any) {
    // PushToken.findAll({where: {requestIdentifier: identifier}}).then(callback);
}

export function deleteStoredPushToken(identifier: string, token: string) {
    /*PushToken.findOne({requestIdentifier: identifier, token}).then((pushToken) => {
        pushToken.destroy();
    });*/
}
