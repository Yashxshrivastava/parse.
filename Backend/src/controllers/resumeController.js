import fs from "fs";
import { dbRun, dbGet } from "../services/db.js";
import { extractTextFromFile } from "../services/extractor.js";
import { parseResumeText } from "../services/parser.js";

export async function uploadAndParseResume(req, res) {
    if (!req.file) {
        return res.status(400).json({
            error: "Please upload a PDF or DOCX resume."
        });
    }

    const { originalname, path, mimetype } = req.file;

    try {
        const { insertId } = await dbRun(
            "INSERT INTO resumes (filename, is_parsed) VALUES (?, ?)",
            [originalname, 0]
        );

        const rawText = await extractTextFromFile(path, mimetype);
        const parsedData = parseResumeText(rawText);

        await dbRun(
            `UPDATE resumes
             SET raw_text = ?, parsed_json = ?, is_parsed = 1
             WHERE id = ?`,
            [rawText, JSON.stringify(parsedData), insertId]
        );

        return res.json({
            success: true,
            resumeId: insertId,
            is_parsed: true,
            parsed_data: parsedData,
        });

    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    } finally {
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
    }
}

export async function getResumeStatus(req, res) {
    try {
        const resume = await dbGet(
            "SELECT * FROM resumes WHERE id = ?",
            [req.params.id]
        );

        if (!resume) {
            return res.status(404).json({
                error: "Resume not found"
            });
        }

        return res.json({
            id: resume.id,
            filename: resume.filename,
            is_parsed: Boolean(resume.is_parsed),
            raw_text: resume.raw_text,
            parsed_data: resume.parsed_json
                ? JSON.parse(resume.parsed_json)
                : null,
            created_at: resume.created_at,
        });

    } catch (err) {
        return res.status(500).json({
            error: "Failed to fetch resume."
        });
    }
}