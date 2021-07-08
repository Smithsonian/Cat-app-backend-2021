import asyncHandler from '../middlewares/asyncHandler.js';
import Observation from '../models/Observation.js';

export const getObservations = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startAt = (page - 1) * limit;
  const endAt = page * limit;
  const total = await Observation.countDocuments();
  const pagination = {};
  if (startAt > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  if (endAt < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  const observations = await Observation.find().skip(startAt).limit(limit);
  res.status(200).json({ pagination, observations });
});
