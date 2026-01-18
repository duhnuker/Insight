import express from "express";
import pkg from 'pg';
const { Pool } = pkg;
import cors from "cors";
import 'dotenv/config';
import jwtAuth from "./routes/jwtAuth.js";
import landing from "./routes/landing.js";
import userHome from "./routes/userHome.js";
import profile from "./routes/profile.js";
import resumeBuilder from "./routes/resumeBuilder.js";
import { createClient } from '@supabase/supabase-js';
import redisClient from "./redisClient.js";



const app = express();
app.use(cors({
    origin: [
        'https://insight-eosin-tau.vercel.app',
        'http://localhost:5173'
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

const isProduction = process.env.NODE_ENV === 'production';

export const pool = new Pool({
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    user: String(isProduction ? process.env.SUPABASE_DB_USER : process.env.DB_USER),
    host: String(isProduction ? process.env.SUPABASE_DB_HOST : process.env.DB_HOST),
    database: String(isProduction ? process.env.SUPABASE_DB_NAME : process.env.DB_NAME),
    password: String(isProduction ? process.env.SUPABASE_PASSWORD : process.env.DB_PASSWORD),
    port: 5432
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected successfully');
    }
});

export const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

app.use("/auth", jwtAuth);
app.use("/api/landing", landing);
app.use("/api/userhome", userHome);
app.use("/api/profile", profile);
app.use("/api/resumeBuilder", resumeBuilder);

app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

// Database keep-alive to prevent Supabase hibernation
setInterval(async () => {
    try {
        await pool.query('SELECT 1');
        console.log('Keep-alive query successful');
    } catch (err) {
        console.error('Keep-alive query failed:', err);
    }
}, 12 * 60 * 60 * 1000);
