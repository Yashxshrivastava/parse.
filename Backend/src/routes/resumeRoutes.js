import express from 'express';
import multer from 'multer';
import { uploadAndParseResume, getResumeStatus } from '../controllers/resumeController.js';

const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) =>
            cb(null, process.env.UPLOAD_DIR || "uploads"),

        filename: (req, file, cb) =>
            cb(null, `${Date.now()}-${file.originalname}`),
    }),

    fileFilter: (req, file, cb) => {
        const allowed = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        cb(
            allowed.includes(file.mimetype)
                ? null
                : new Error("Only PDF and DOCX files are allowed."),
            allowed.includes(file.mimetype)
        );
    },
});

router.post("/upload", upload.single("resume"), uploadAndParseResume);
router.get("/:id", getResumeStatus);

export default router;