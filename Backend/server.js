import express from 'express';
import 'dotenv/config.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import UserRoutes from './src/routes/UserRoutes.js';
import GroupRoutes from './src/routes/groupRoutes.js';
import { connectDB } from './src/config/db.js';
import expenseRoutes from "./src/routes/expenseRoutes.js";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
connectDB();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// For production, allow any origin or specify your domain
const FrontendUrl = process.env.NODE_ENV === 'production'
    ? "https://splitmate-pvhu.onrender.com"
    : "http://localhost:5317";

app.use(cors({
    origin: FrontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(cookieParser());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../Frontend/dist')));

// API routes
app.use('/api/users', UserRoutes);
app.use('/api/groups', GroupRoutes);
app.use("/api/expenses", expenseRoutes);

app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/dist/index.html'));
});


app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
