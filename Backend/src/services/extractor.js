import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

const WORD_TYPES = new Set([
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export async function extractTextFromFile(filePath, mimeType) {
    const buffer = fs.readFileSync(filePath);

    if (mimeType === "application/pdf") {
        return (await pdfParse(buffer)).text;
    }

    if (WORD_TYPES.has(mimeType)) {
        return (await mammoth.extractRawText({ buffer })).value;
    }

    throw new Error("Only PDF and DOCX files are supported.");
}