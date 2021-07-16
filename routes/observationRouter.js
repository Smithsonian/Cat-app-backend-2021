import express from 'express';
import {
  getObservations,
  getObservationsPage,
  getSingleObservation,
  updateObservation
} from '../controllers/observationController.js';
import verifyToken from '../middlewares/verifyToken.js';

const observationRouter = express.Router();

observationRouter.post('/', verifyToken, getObservations);
observationRouter.get('/page/', verifyToken, getObservationsPage);
observationRouter.get('/:id', verifyToken, getSingleObservation);
observationRouter.patch('/:id', verifyToken, updateObservation);

export default observationRouter;
