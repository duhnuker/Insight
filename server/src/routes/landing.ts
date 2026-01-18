import express, { Request, Response, Router } from "express";
import { pool } from "../index.js";
import authorise from "../middleware/authorise.js";
import axios from "axios";
import redisClient from "../redisClient.js";


const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const cacheKey = 'adzuna_jobs_landing';
        const cachedJobs = await redisClient.get(cacheKey);

        if (cachedJobs) {
            console.log("Cache Hit: Landing jobs");
            res.json(JSON.parse(cachedJobs));
            return;
        }

        console.log("Cache Miss: Fetching from Adzuna");
        const APP_ID = process.env.ADZUNA_APP_ID;
        const APP_KEY = process.env.ADZUNA_APP_KEY;

        const baseURL = 'https://api.adzuna.com/v1/api/jobs/au/search/1';

        const params = {
            app_id: APP_ID,
            app_key: APP_KEY,
            results_per_page: 10
        };

        const headers = {
            'Content-Type': 'application/json'
        };

        const response = await axios.get(baseURL, { params, headers });
        const jobs = response.data.results;

        await redisClient.setEx(cacheKey, 3600, JSON.stringify(jobs));

        res.json(jobs);

    } catch (error) {
        console.error("Error in landing route:", error);
        res.status(500).json({ error: "Error fetching job listings" });
    }
});

export default router;
