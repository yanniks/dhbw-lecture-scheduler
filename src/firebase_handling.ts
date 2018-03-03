import * as admin from "firebase-admin";
import {getPushTokens} from "./database_support";

admin.initializeApp({
    credential: admin.credential.cert(require("../private/firebaseadminsdk.json")),
    databaseURL: "https://dhbw-lecture-scheduler.firebaseio.com",
});

export function sendNotificationsForCourse(course: string) {
    getPushTokens(course, (tokens) => {
        tokens.forEach((token) => {
            const message = {
                data: {
                    course,
                },
                token: token.token,
            };
            admin.messaging().send(message)
                .then((response) => {
                    return;
                })
                .catch((error) => {
                    console.error("Could not send push notification.", error);
                });
        });
    });
}
