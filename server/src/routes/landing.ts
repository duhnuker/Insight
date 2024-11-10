import express, { Request, Response, Router } from "express";
import { pool } from "../index";
import authorise from "../middleware/authorise";
import axios from "axios";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const APP_ID = process.env.ADZUNA_APP_ID;
        const APP_KEY = process.env.ADZUNA_APP_KEY;
        
        const baseURL = 'https://api.adzuna.com/v1/api/jobs/au/search/1';
        
        const params = {
            app_id: APP_ID,
            app_key: APP_KEY,
            results_per_page: 15
        };

        const headers = {
            'Content-Type': 'application/json'
        };

        const response = await axios.get(baseURL, { params, headers });
        const jobs = response.data.results;
        
        res.json(jobs);

    } catch (error) {
        res.status(500).json({ error: "Error fetching job listings" });
    }
});


export default router;