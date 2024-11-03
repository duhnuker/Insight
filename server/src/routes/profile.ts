import express, { Request, Response, Router } from "express";
import { pool } from "../index";
import authorise from "../middleware/authorise";

const router: Router = express.Router();

// Get user profile
router.get("/", authorise, async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: "Unauthorised" });
            return;
        }

        const userProfile = await pool.query("SELECT u.id, u.name, u.email, p.skills, p.experience FROM users u LEFT JOIN profile p ON u.id = p.user_id WHERE u.id = $1", [req.user.id]);
        res.json(userProfile.rows[0]);

    } catch (error: unknown) {
        console.error(error instanceof Error ? error.message : "Unknown error");
        res.status(500).json({ message: "Server Error"});
    }
});

// Update profile

// Delete profile

export default router;
