import express from 'express';
import { getObservations } from '../controllers/observationController.js';
import verifyToken from '../middlewares/verifyToken.js';

const observationRouter = express.Router();

observationRouter.get('/', verifyToken, getObservations);

export default observationRouter;
