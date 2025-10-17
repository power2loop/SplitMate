import express from 'express';
import 'dotenv/config.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import UserRoutes from './src/routes/UserRoutes.js';
import GroupRoutes from './src/routes/groupRoutes.js';
import { connectDB } from './src/config/db.js';
import expenseRoutes from "./src/routes/expenseRoutes.js";

const app = express();
connectDB();

const FrontendUrl = "http://localhost:5317"

app.use(cors({
    origin: FrontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(cookieParser());

// API routes first
app.get('/', (_req, res) => res.send('API is running...'));
app.use('/api/users', UserRoutes);
app.use('/api/groups', GroupRoutes);
app.use("/api/expenses", expenseRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
