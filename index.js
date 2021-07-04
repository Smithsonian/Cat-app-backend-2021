import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import authRouter from './routes/authRouter.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.ORIGIN }));
app.use(express.json());
app.use('/auth', authRouter);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
