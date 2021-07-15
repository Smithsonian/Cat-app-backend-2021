import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config.js';
import './db/mongoose.js';
import authRouter from './routes/authRouter.js';
import observationRouter from './routes/observationRouter.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.set('etag', false);
app.use(morgan('tiny'));
app.use(cors({ origin: process.env.ORIGIN }));
app.use('/auth', authRouter);
app.use('/observations', observationRouter);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
