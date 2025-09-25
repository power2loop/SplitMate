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

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5317',
    withCredentials: true // allow cookies/auth headers
}));

app.get('/', (_req, res) => res.send('API is running...'));

app.use('/api/users', UserRoutes);
app.use('/api/groups', GroupRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
