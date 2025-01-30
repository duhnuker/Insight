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
import { supabase } from "../index.js";

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
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf'];
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
    if (!req.file || !req.user) {
      res.status(400).json({ error: 'Invalid request' });
      return;
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const filePath = `resumes/${req.user.id}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) throw error;

    const { rows } = await pool.query(
      'INSERT INTO resume_uploads (user_id, filename, status) VALUES ($1, $2, $3) RETURNING id',
      [req.user.id, filePath, 'pending']
    );

    res.json({ id: rows[0].id });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
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

    const filePath = rows[0].filename;
    
    const { data, error } = await supabase.storage
      .from('resumes')
      .download(filePath);

    if (error) throw error;

    const buffer = Buffer.from(await data.arrayBuffer());
    const tempFilePath = `/tmp/${path.basename(filePath)}`;
    await fsPromises.writeFile(tempFilePath, buffer);

    const resumeText = await textractFromFile(tempFilePath);
    await fsPromises.unlink(tempFilePath);

    const prompt = `Analyze this resume and provide a clear, structured analysis with specific recommendations:

    Resume Text:
    ${resumeText}

    Please provide specific feedback in these areas:
    - Format & Structure: Evaluate the layout and organization
    - Content Quality: Assess the descriptions and achievements
    - Professional Impact: Review how effectively experience is communicated
    - Key Skills: Identify important skills and suggest additions`;

    const response = await hf.textGeneration({
      model: "tiiuae/falcon-7b-instruct",
      inputs: prompt,
      parameters: {
        max_length: 800,
        temperature: 0.3,
        top_p: 0.9,
        repetition_penalty: 1.2
      }
    });

    let outputOnly = response.generated_text;
    if (response.generated_text.includes("suggest additions")) {
      outputOnly = response.generated_text.split("suggest additions")[1]?.trim() || response.generated_text;
    }

    const analysisData = {
      content: outputOnly,
      timestamp: new Date().toISOString()
    };

    await pool.query(
      'UPDATE resume_uploads SET analysis = $1, status = $2 WHERE id = $3',
      [analysisData, 'completed', req.params.id]
    );

    res.json({ analysis: outputOnly });

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

    const filePath = rows[0].filename;
    
    const { data, error } = await supabase.storage
      .from('resumes')
      .createSignedUrl(filePath, 60);

    if (error) throw error;

    res.json({ url: data.signedUrl });
  } catch (error) {
    console.error('File retrieval error:', error);
    res.status(500).json({ error: 'File retrieval failed' });
  }
});



export default router;
