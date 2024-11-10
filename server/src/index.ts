import express  from "express";
import pkg from "pg";
const { Pool } = pkg;
import cors from "cors";
import 'dotenv/config';
import jwtAuth from "./routes/jwtAuth.js";
import landing from "./routes/landing.js";
import profile from "./routes/profile.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

export const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_NAME,
    password: process.env.PG_PASSWORD,
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

app.use("/auth", jwtAuth);
app.use("/api/landing", landing);
app.use("/api/profile", profile);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});