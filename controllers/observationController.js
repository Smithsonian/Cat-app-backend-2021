import asyncHandler from '../middlewares/asyncHandler.js';
import Observation from '../models/Observation.js';

export const getObservations = asyncHandler(async (req, res) => {
  const observations = await Observation.find();
  res.status(200).json(observations);
});
