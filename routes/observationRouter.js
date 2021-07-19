import express from 'express';
import {
  getObservations,
  getObservationsPage,
  getSingleObservation,
  updateObservation,
  createNewCat,
  removeIdentification
} from '../controllers/observationController.js';
import verifyToken from '../middlewares/verifyToken.js';

const observationRouter = express.Router();

observationRouter.post('/', verifyToken, getObservations);
observationRouter.get('/:id', verifyToken, getSingleObservation);
observationRouter.patch('/:id', verifyToken, updateObservation);
observationRouter.post('/:id/newcat', verifyToken, createNewCat);
observationRouter.post('/:id/removeid', verifyToken, removeIdentification);

observationRouter.get('/page/', verifyToken, getObservationsPage);

export default observationRouter;
