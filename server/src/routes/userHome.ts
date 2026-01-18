import express, { Request, Response, Router } from "express";
import { pipeline } from '@xenova/transformers';
import { pool } from "../index.js";
import authorise from "../middleware/authorise.js";
import axios from "axios";
import redisClient from "../redisClient.js";

const router: Router = express.Router();

async function getAdzunaJobs() {
    const cacheKey = 'adzuna_jobs_raw';
    const cachedJobs = await redisClient.get(cacheKey);

    if (cachedJobs) {
        return JSON.parse(cachedJobs);
    }

    const APP_ID = process.env.ADZUNA_APP_ID;
    const APP_KEY = process.env.ADZUNA_APP_KEY;

    const baseURL = 'https://api.adzuna.com/v1/api/jobs/au/search/1';

    const params = {
        app_id: APP_ID,
        app_key: APP_KEY,
        results_per_page: 10
    };

    const response = await axios.get(baseURL, { params });
    const jobs = response.data.results;

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(jobs));
    return jobs;
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

    // Get top 3 matches
    const scores = [...result.scores];
    const topThreeIndices = scores
        .map((score, index) => ({ score, index }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(item => item.index);

    return topThreeIndices.map(index => jobs[index]);
}


router.get("/", authorise, async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: "Unauthorised" });
            return;
        }

        const userId = req.user.id;
        const cacheKey = `user_recommendations:${userId}`;

        const cachedRecs = await redisClient.get(cacheKey);
        if (cachedRecs) {
            console.log(`Cache Hit: Recommendations for user ${userId}`);
            const data = JSON.parse(cachedRecs);
            res.json(data);
            return;
        }

        console.log(`Cache Miss: Computing recommendations for user ${userId}`);

        const userData = await pool.query(
            "SELECT u.name, p.skills, p.experience FROM users u LEFT JOIN profile p ON u.id = p.user_id WHERE u.id = $1",
            [userId]
        );

        if (userData.rows.length === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const jobs = await getAdzunaJobs();
        const userProfile = `Skills: ${userData.rows[0].skills || ''}\nExperience: ${userData.rows[0].experience || ''}`;

        const recommendedJobs = await getJobRecommendations(userProfile, jobs);

        const responseData = {
            name: userData.rows[0].name,
            recommendedJobs: recommendedJobs
        };

        await redisClient.setEx(cacheKey, 3600, JSON.stringify(responseData));

        res.json(responseData);

    } catch (error: unknown) {
        console.error(error instanceof Error ? error.message : "Unknown error");
        res.status(500).json({ message: "Server Error" });
    }
});





export default router;


