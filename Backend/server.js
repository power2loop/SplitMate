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
import fs from 'fs';

const app = express();
connectDB();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if dist folder exists
const distPath = path.join(__dirname, '../Frontend/dist');
console.log('Dist path:', distPath);
console.log('Dist exists:', fs.existsSync(distPath));
if (fs.existsSync(distPath)) {
    console.log('Dist contents:', fs.readdirSync(distPath));
}

const FrontendUrl = process.env.NODE_ENV === 'production'
    ? "https://splitmate-pvhu.onrender.com/"
    : "http://localhost:5317";

app.use(cors({
    origin: FrontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(cookieParser());

// Serve static files
app.use(express.static(distPath));

// API routes
app.use('/api/users', UserRoutes);
app.use('/api/groups', GroupRoutes);
app.use("/api/expenses", expenseRoutes);

// Catch-all route
app.get('/*splat', (req, res) => {
    console.log('Catch-all route hit for:', req.url);
    res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
