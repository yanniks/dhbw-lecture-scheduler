function prepareDay(content: string[][]): Promise<string[][]> {
    const lectures: string[][] = [];
    let nextRowAnalyzed = false;
    for (let i = 0; i < content.length; i++) {
        if (nextRowAnalyzed) {
            nextRowAnalyzed = false;
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
                nextRowAnalyzed = true;
                for (let k = 0; k < secondValue.length; k++) {
                    // Check if that row contains whitespaces that are not supposed to be there
                    if (secondValue[k].indexOf("         ") > -1) {
                        let partsToMove = secondValue[k].split("         ");
                        partsToMove = partsToMove.filter((x) => x);
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
    return Promise.resolve(lectures);
}

export async function createDay(data: Buffer): Promise<string[][]> {
    const PDFJS = require("pdfjs-dist/build/pdf");
    const pdfTableExtractor = require("../pdf-table-extractor").default;
    return PDFJS.getDocument(data).then(pdfTableExtractor).then((result: any) => {
        return prepareDay(result.pageTables[0].tables);
    });
}
