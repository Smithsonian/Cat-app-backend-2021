import asyncHandler from '../middlewares/asyncHandler.js';
import Observation from '../models/Observation.js';

export const getObservations = asyncHandler(async (req, res) => {
  const { minLon, maxLon, minLat, maxLat } = req.query;
  const reqQuery = { ...req.query };

  const removeFields = ['page', 'limit', 'minLon', 'maxLon', 'minLat', 'maxLat'];
  removeFields.forEach(param => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery).replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  if (minLon && maxLon && minLat && maxLon) {
    const range = {
      topLeft: [minLon, maxLat],
      bottomRight: [maxLon, minLat],
      topRight: [maxLon, maxLat],
      bottomLeft: [minLon, minLat]
    };

    const geo = {
      location: {
        $geoWithin: {
          $geometry: {
            type: 'Polygon',
            coordinates: [
              [range.topLeft, range.topRight, range.bottomRight, range.bottomLeft, range.topLeft]
            ]
          }
        }
      }
    };

    queryStr = JSON.stringify({ ...JSON.parse(queryStr), ...geo });
  }

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
  const query = Observation.find(JSON.parse(queryStr));
  const observations = await query.skip(startAt).limit(limit);
  res.status(200).json({ pagination, observations });
});