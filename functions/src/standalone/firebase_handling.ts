import * as admin from "firebase-admin";
import {getPushTokens, unregisterToken} from "./database_support";

export function sendNotificationsForCourse(course: string) {
    getPushTokens(course, (tokens: any) => {
        tokens.forEach((token: any) => {
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
                    if (error.code === "messaging/registration-token-not-registered") {
                        unregisterToken(token);
                    }
                });
        });
    });
}
