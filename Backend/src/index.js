import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import cors from 'cors';
import resumeRoutes from './routes/resumeRoutes.js';
import multer from 'multer';
import { initializeDatabase } from './services/db.js';


const app = express();
const PORT = process.env.PORT || 3000;

// Ensure local temporary upload directories exist
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing Middleware
app.use('/api/resume', resumeRoutes);

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `Upload error: ${err.message}` });
    }
    return res.status(400).json({ error: err.message });
});

async function startServer() {
    try {
        await initializeDatabase();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Endpoint: POST http://localhost:${PORT}/api/resume/upload`);
        });
    } catch (err) {
        console.error('Failed to start server due to database error:', err);
        process.exit(1);
    }
}

startServer();
