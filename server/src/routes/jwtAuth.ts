import express, { Request, Response } from "express";
import { pool } from "../index.js";
import bcrypt from "bcrypt";
import jwtGenerator from "../utils/jwtGenerator.js";
import validateInfo from "../middleware/validateInfo.js"
import authorise from "../middleware/authorise.js";

const router = express.Router();

interface User {
    id: string;
    email: string;
    password: string;
}

//Register
router.post("/register", validateInfo, async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, skills, experience } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        //Check if user already exists
        if (user.rows.length > 0) {
            res.status(409).send("User already exists");
            return;
        }

        //Bcrypt user password
        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);

        //Add new user to database
        let newUser = await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *", [name, email, bcryptPassword]);

        const skillsArray = Array.isArray(skills) ? skills : skills.split(',').map((s: string) => s.trim());
        const experienceArray = Array.isArray(experience) ? experience : experience.split(',').map((e: string) => e.trim());

        //Create profile for the new user
        await pool.query(
            "INSERT INTO profile (user_id, name, email, skills, experience) VALUES ($1, $2, $3, $4::text[], $5::text[])",
            [newUser.rows[0].id, name, email, skillsArray, experienceArray]
        );

        const jwtToken = jwtGenerator(newUser.rows[0].id);
        res.json({ jwtToken });
        return;

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An unknown error occurred");
        }
        res.status(500).send("Server Error");
        return;
    }
});

router.post("/login", validateInfo, async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as { email: string; password: string };

    try {
        const user = await pool.query<User>("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            res.status(401).json("Password or Email is incorrect");
            return;
        }

        // Check if incoming password is correct
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            res.status(401).json("Password or Email is incorrect");
            return;
        }

        // Give them the JWT token
        const jwtToken = jwtGenerator(user.rows[0].id);
        res.json({ jwtToken });
        return;

    } catch (error) {
        console.error((error as Error).message);
        res.status(500).send("Server Error");
        return;
    }
});

router.post("/verify", authorise, async (req: Request, res: Response): Promise<void> => {
    try {
        res.json(true);
        console.error("User verified");
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('An unknown error occurred');
        }
        res.status(500).send("Server Error");
        return;
    }
});

export default router;
