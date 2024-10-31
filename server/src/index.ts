import express  from "express";
import pkg from "pg";
const { Pool } = pkg;
import cors from "cors";
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

export const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_NAME,
    password: process.env.PG_PASSWORD,
    port: 5432
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});