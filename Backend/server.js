import express from 'express';
import 'dotenv/config.js';
import { connectDB } from './src/config/db.js';
import { use } from 'react';

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());

connectDB();



app.get('/', (req, res) => {
    res.send('API is running...');
});
app.use('/api/users', userRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
