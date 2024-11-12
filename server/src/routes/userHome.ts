import express, { Request, Response, Router } from "express";
import { pool } from "../index.js";
import authorise from "../middleware/authorise.js";
import axios from "axios";

const router: Router = express.Router();


//AI to assess user data in profile (Skills experience etc.)
//Based on this it will gather jobs relavant to it

// Get user data for home page
router.get("/", authorise, async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: "Unauthorised" });
            return;
        }

        const userData = await pool.query(
            "SELECT name FROM users WHERE id = $1",
            [req.user.id]
        );

        res.json(userData.rows[0]);

    } catch (error: unknown) {
        console.error(error instanceof Error ? error.message : "Unknown error");
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;


