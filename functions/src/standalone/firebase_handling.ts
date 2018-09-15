import * as admin from "firebase-admin";
import {deleteStoredPushToken, getPushTokens} from "./database_support";

export async function sendNotificationsForCourse(course: string) {
    const tokens = await getPushTokens(course);
    if (!tokens) {
        return;
    }
    tokens.registrations.forEach((token: any) => {
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
            .catch(async (error) => {
                console.error("Could not send push notification.", error);
                if (error.code === "messaging/registration-token-not-registered") {
                    await deleteStoredPushToken(course, token);
                }
            });
    });
}
