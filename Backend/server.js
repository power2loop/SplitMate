// server.js (or src/app.js)
import express from 'express';
import 'dotenv/config.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import UserRoutes from './src/routes/UserRoutes.js';
import GroupRoutes from './src/routes/GroupRoutes.js';
import { connectDB } from './src/config/db.js';
import expenseRoutes from "./src/routes/ExpenseRoutes.js";
import path from "path";
import { fileURLToPath } from 'url';


const app = express();
connectDB();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FrontendUrl = "http://localhost:5173"

app.use(cors({
    origin: FrontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../Frontend/dist')));
app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/Frontend/dist/index.html"));
})
app.get('/', (_req, res) => res.send('API is running...'));

app.use('/api/users', UserRoutes);
app.use('/api/groups', GroupRoutes);
app.use("/api/expenses", expenseRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
