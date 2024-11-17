import express, { Request, Response, Router } from "express";
import { pool } from "../index.js";
import authorise from "../middleware/authorise.js";
import multer from "multer";
import path from "path";
import { pipeline } from "@xenova/transformers";

const router: Router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });


router.post("/upload", authorise, upload.single('resume'), async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
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

    const filePath = path.join('./uploads/', rows[0].filename);

    const pipe = await pipeline('text-classification', 'Xenova/resume-classifier');
    const result = await pipe(filePath);

    await pool.query(
      'UPDATE resume_uploads SET analysis = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [JSON.stringify(result), 'completed', req.params.id]
    );

    res.json({ feedback: result });
  } catch (error) {
    res.status(500).json({ error: 'Analysis failed' });
  }
});

export default router;
