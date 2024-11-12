import express, { Request, Response, Router } from "express";
import { pipeline } from '@xenova/transformers';
import { pool } from "../index.js";
import authorise from "../middleware/authorise.js";
import axios from "axios";

const router: Router = express.Router();

async function getAdzunaJobs() {
    const APP_ID = process.env.ADZUNA_APP_ID;
    const APP_KEY = process.env.ADZUNA_APP_KEY;

    const baseURL = 'https://api.adzuna.com/v1/api/jobs/au/search/1';

    const params = {
        app_id: APP_ID,
        app_key: APP_KEY,
        results_per_page: 10
    };

    const response = await axios.get(baseURL, { params });
    return response.data.results;
}

interface ZeroShotOutput {
    labels: string[];
    scores: number[];
}

async function getJobRecommendations(userProfile: string, jobs: any[]) {
    const classifier = await pipeline('zero-shot-classification', 'Xenova/distilbert-base-uncased-mnli');
    
    if (jobs.length === 0) {
        return null;
    }

    const jobDescriptions = jobs.map(job => job.description);
    const result = await classifier(userProfile, jobDescriptions) as ZeroShotOutput;
    const topMatchIndex = result.scores.indexOf(Math.max(...result.scores));

    return jobs[topMatchIndex];
}


router.get("/", authorise, async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: "Unauthorised" });
            return;
        }

        // Get user data from Users table
        const userData = await pool.query(
            "SELECT u.name, p.skills, p.experience FROM users u LEFT JOIN profile p ON u.id = p.user_id WHERE u.id = $1",
            [req.user.id]
        );

        // Get jobs and create user profile string
        const jobs = await getAdzunaJobs();
        const userProfile = `Skills: ${userData.rows[0].skills || ''}\nExperience: ${userData.rows[0].experience || ''}`;
        
        // Get recommended job
        const recommendedJob = await getJobRecommendations(userProfile, jobs);

        // Send both user data and recommended job
        res.json({
            name: userData.rows[0].name,
            recommendedJob
        });

    } catch (error: unknown) {
        console.error(error instanceof Error ? error.message : "Unknown error");
        res.status(500).json({ message: "Server Error" });
    }
});




export default router;


