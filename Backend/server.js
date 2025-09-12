import express from 'express';
import 'dotenv/config.js';
import cors from 'cors'
import UserRoutes from './src/routes/UserRoutes.js'
import { connectDB } from './src/config/db.js';

const app = express();
const PORT = process.env.PORT;

//Connect Database.
connectDB();


app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('API is running...');
});


app.use('/api/users', UserRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
