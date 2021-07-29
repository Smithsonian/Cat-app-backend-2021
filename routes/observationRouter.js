import express from 'express';
import {
  getObservations,
  getSingleObservation,
  getCandidates,
  updateObservation,
  createNewCat,
  removeIdentification,
  getDeployments,
  getCounters
} from '../controllers/observationController.js';
import verifyToken from '../middlewares/verifyToken.js';

const observationRouter = express.Router();

observationRouter.get('/deployments', verifyToken, getDeployments);
observationRouter.get('/counters', verifyToken, getCounters);
observationRouter.post('/candidates', verifyToken, getCandidates);
observationRouter.post('/', verifyToken, getObservations);
observationRouter.get('/:id', verifyToken, getSingleObservation);
observationRouter.patch('/:id', verifyToken, updateObservation);
observationRouter.post('/:id/newcat', verifyToken, createNewCat);
observationRouter.post('/:id/removeid', verifyToken, removeIdentification);

export default observationRouter;
