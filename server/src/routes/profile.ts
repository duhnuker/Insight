import express, { Request, Response, Router } from "express";
import { pool } from "../index.js";
import authorise from "../middleware/authorise.js";

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
        res.status(500).json({ message: "Server Error" });
    }
});

// Update profile
router.put("/", authorise, async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: "Unauthorised" });
            return;
        }

        const { name, email, skills, experience } = req.body;

        await pool.query(
            "UPDATE users SET name = $1, email = $2, user_updated_at = CURRENT_TIMESTAMP WHERE id = $3",
            [name, email, req.user.id]
        );

        const profileExists = await pool.query(
            "SELECT * FROM profile WHERE user_id = $1",
            [req.user.id]
        );

        if (profileExists.rows.length > 0) {
            await pool.query(
                "UPDATE profile SET name = $1, email = $2, skills = $3, experience = $4, updated_at = CURRENT_TIMESTAMP WHERE user_id = $5",
                [name, email, skills, experience, req.user.id]
            );
        } else {
            await pool.query(
                "INSERT INTO profile (user_id, name, email, skills, experience) VALUES ($1, $2, $3, $4, $5)",
                [req.user.id, name, email, skills, experience]
            );
        }

        res.json({ message: "Profile updated successfully" });

    } catch (error: unknown) {
        console.error(error instanceof Error ? error.message : "Unknown error");
        res.status(500).json({ message: "Server Error" });
    }
});



// Delete profile
router.delete("/:id", authorise, async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: "Unauthorised" });
            return;
        }

        const { id } = req.params;

        await pool.query("DELETE FROM recommendations WHERE user_id = $1", [req.user.id]);
        
        await pool.query("DELETE FROM profile WHERE user_id = $1", [req.user.id]);
        
        const deleteUser = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [req.user.id]);

        if (deleteUser.rows.length === 0) {
            res.json("The user does not exist!");
            return;
        }

        res.json("User was successfully deleted");

    } catch (error: unknown) {
        console.error(error instanceof Error ? error.message : "Unknown error");
        res.status(500).json({ message: "Server Error" });
    }
});


export default router;
