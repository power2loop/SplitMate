// server.js (or src/app.js)
import express from 'express';
import 'dotenv/config.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import UserRoutes from './src/routes/UserRoutes.js';
import GroupRoutes from './src/routes/GroupRoutes.js';
import { connectDB } from './src/config/db.js';

const app = express();
connectDB();
const ORIGIN = "http://localhost:5317";



app.use(cors({
    origin: ORIGIN,                 // exact origin, not "*"
    credentials: true,              // adds Access-Control-Allow-Credentials: true
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
})); // handles preflight for these routes too

app.use(express.json());
app.use(cookieParser());

app.get('/', (_req, res) => res.send('API is running...'));

app.use('/api/users', UserRoutes);
app.use('/api/groups', GroupRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
