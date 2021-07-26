import express from 'express';
import {
  getObservations,
  getObservationsPage,
  getSingleObservation,
  updateObservation,
  createNewCat,
  removeIdentification,
  getDeployments,
  getCounters
} from '../controllers/observationController.js';
import verifyToken from '../middlewares/verifyToken.js';

const observationRouter = express.Router();

observationRouter.post('/', verifyToken, getObservations);
observationRouter.get('/deployments', verifyToken, getDeployments);
observationRouter.get('/counters', verifyToken, getCounters);
observationRouter.get('/:id', verifyToken, getSingleObservation);
observationRouter.patch('/:id', verifyToken, updateObservation);
observationRouter.post('/:id/newcat', verifyToken, createNewCat);
observationRouter.post('/:id/removeid', verifyToken, removeIdentification);

observationRouter.get('/page/', verifyToken, getObservationsPage);

export default observationRouter;
