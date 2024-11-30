import express, { Request, Response, Router } from "express";
import { pool } from "../index.js";
import authorise from "../middleware/authorise.js";
import multer from "multer";
import path from "path";
import fs from 'fs-extra';
import textract from 'textract';
import { promises as fsPromises } from 'fs';
import { promisify } from "util";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

const textractFromFile = promisify(textract.fromFileWithPath);

const router: Router = express.Router();

(async () => {
  await fsPromises.mkdir('./uploads', { recursive: true });
})();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});


router.post("/upload", authorise, upload.single('resume'), async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Please upload a valid .doc or .docx file' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { rows } = await pool.query(
      'INSERT INTO resume_uploads (user_id, filename, status) VALUES ($1, $2, $3) RETURNING id',
      [req.user.id, req.file.filename, 'pending']
    );

    res.json({ id: rows[0].id });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed. Please ensure your file is a valid .doc or .docx document under 5MB'
    });
  }
});


router.get("/analysis/:id", authorise, async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { rows } = await pool.query(
      'SELECT filename FROM resume_uploads WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (!rows.length) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }

    const filePath = path.join('./uploads/', rows[0].filename);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'Resume file not found' });
      return;
    }

    // Extract text
    const resumeText = await textractFromFile(filePath);

    // Add this after extracting text
    const prompt = `Analyze this resume and provide specific improvements:
    ${resumeText}
    Focus on:
    1. Format and structure
    2. Content strength
    3. Professional impact
    4. Keywords and skills`;

    const response = await hf.textGeneration({
      model: "google/flan-t5-base",
      inputs: prompt,
      parameters: {
        max_length: 500,
        temperature: 0.7
      }
    });

    const analysisData = {
      content: response.generated_text,
      timestamp: new Date().toISOString()
    };

    await pool.query(
      'UPDATE resume_uploads SET analysis = $1, status = $2 WHERE id = $3',
      [analysisData, 'completed', req.params.id]
    );

    res.json({ analysis: response.generated_text });



  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});


router.get("/file/:id", authorise, async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { rows } = await pool.query(
      'SELECT filename FROM resume_uploads WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (!rows.length) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }

    const filePath = path.join('./uploads/', rows[0].filename);
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ error: 'File retrieval failed' });
  }
});


export default router;
