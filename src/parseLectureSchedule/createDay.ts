import * as pdf_table_extractor from "pdf-table-extractor";

function prepareDay(content: string[][], callback: any) {
    const lectures: string[][] = [];
    for (let i = 0; i < content.length; i++) {
        if (i % 2) {
            continue;
        }
        const firstColumn = content[i];
        const secondColumn = content[i + 1];
        for (let j = 0; j < firstColumn.length; j++) {
            const firstValue = firstColumn[j];
            const secondValue: string[] = secondColumn[j].split("\n");
            if (firstValue.indexOf("Montag") > -1 || firstValue.indexOf("Dienstag") > -1 ||
                firstValue.indexOf("Mittwoch") > -1 || firstValue.indexOf("Donnerstag") > -1 ||
                firstValue.indexOf("Freitag") > -1) {
                for (let k = 0; k < secondValue.length; k++) {
                    // Check if that row contains whitespaces that are not supposed to be there
                    if (secondValue[k].indexOf("         ") > -1) {
                        let partsToMove = secondValue[k].split("         ");
                        partsToMove = partsToMove.filter((x) => x);
                        console.log(partsToMove);
                        secondValue[k] = partsToMove[0];
                        for (let l = 1; l < partsToMove.length; l++) {
                            const firstChars = partsToMove[l];
                            const secondValueNext = (secondColumn[j + l] || "").split("\n");
                            secondValueNext[k] = firstChars + "\n" + (secondValueNext[k] || "");
                            secondColumn[j + l] = secondValueNext.join("\n");
                        }
                    }
                }
                lectures.push([firstValue, secondValue.join("\n")].join("\n").split("\n"));
            }
        }
    }
    console.log(lectures);
    callback(lectures);
}

export function createDay(course, callback: any) {
    pdf_table_extractor("tmp/" + course + ".pdf", (result) => {
        prepareDay(result.pageTables[0].tables, callback);
    }, (e) => {
        callback([]);
        console.error(e);
    });
}
