import * as fs from "fs";
import * as https from "https";

export function downloadFile(url, callback) {
    const urlSplit = url.split("/");
    const filename = urlSplit[urlSplit.length - 1];
    const file = fs.createWriteStream("tmp/new." + filename);
    https.get(url, (response) => {
        response.pipe(file);
        response.on("end", () => callback(filename));
    });
}
