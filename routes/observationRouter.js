import express from 'express';
import {
  getObservations,
  getObservationsPage,
  getSingleObservation
} from '../controllers/observationController.js';
import verifyToken from '../middlewares/verifyToken.js';

const observationRouter = express.Router();

observationRouter.post('/', verifyToken, getObservations);
observationRouter.get('/page/', verifyToken, getObservationsPage);
observationRouter.get('/:id', verifyToken, getSingleObservation);

export default observationRouter;
