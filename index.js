import 'dotenv/config.js';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import authRouter from './routes/authRouter.js';
import observationRouter from './routes/observationRouter.js';
import errorHandler from './middlewares/errorHandler.js';
import './db/mongoose.js';

const app = express();
const port = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  const morgan = await import('morgan');
  app.use(morgan.default('dev'));
}

app.use(express.json());
app.use(mongoSanitize());
app.set('etag', false);
app.use(cors({ origin: process.env.ORIGIN }));
app.use('/auth', authRouter);
app.use('/observations', observationRouter);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
