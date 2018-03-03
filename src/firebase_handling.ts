import * as admin from "firebase-admin";
import {getPushTokens} from "./database_support";

export function sendNotificationsForCourse(course: string) {
    const serviceAccount = require("../private/firebaseadminsdk.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://dhbw-lecture-scheduler.firebaseio.com",
    });

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
