import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import Observation from '../models/Observation.js';
import Specimen from '../models/Specimen.js';

export const getDeployments = asyncHandler(async (req, res) => {
  const deploymentsAggregation = await Observation.aggregate([
    {
      $group: {
        _id: { deployment_id: '$deployment_id', location: '$location' }
      }
    }
  ]);
  const deployments = deploymentsAggregation.map(({ _id: { deployment_id, location } }) => ({
    deployment_id,
    location
  }));
  res.status(200).json({ deployments });
});

export const getObservations = asyncHandler(async (req, res) => {
  const { role } = req.user;
  const { minLon, maxLon, minLat, maxLat } = req.body;
  const reqQuery = { ...req.body };
  const removeFields = ['minLon', 'maxLon', 'minLat', 'maxLat'];
  removeFields.forEach(param => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery).replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  console.log(role);
  if (role === 'user') {
    queryStr = JSON.stringify({ ...JSON.parse(queryStr), forReview: false });
  }

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
  console.log(queryStr);
  const observations = await Observation.find(JSON.parse(queryStr));
  res.status(200).json({ observations });
});

export const getObservationsPage = asyncHandler(async (req, res) => {
  const { minLon, maxLon, minLat, maxLat, forReview } = req.query;
  const reqQuery = { ...req.query };

  const removeFields = ['page', 'limit', 'minLon', 'maxLon', 'minLat', 'maxLat', 'forReview'];
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

  queryStr = forReview
    ? JSON.stringify({ ...JSON.parse(queryStr), forReview: true })
    : JSON.stringify({ ...JSON.parse(queryStr), forReview: false });

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
  if (endAt <= total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  const query = Observation.find(JSON.parse(queryStr));
  const observations = await query.skip(startAt).limit(limit);
  res.status(200).json({ pagination, observations });
});

export const getSingleObservation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const observation = await Observation.findById(id);
  res.status(200).json({ observation });
});

export const updateObservation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const filter = { _id: id };
  const update = { ...req.body };
  const options = {
    new: true
  };
  const updatedObservation = await Observation.findOneAndUpdate(filter, update, options);
  res.status(200).json({ updatedObservation });
});

export const createNewCat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const found = await Observation.findById(id);
  if (!found)
    throw new ErrorResponse('Cannot create a new specimen on non existent observation', 404);
  if (found.specimen)
    throw new ErrorResponse(
      'This observation is already linked to a specimen, delete the identification and try again',
      401
    );
  const { _id } = await Specimen.create({ matches: [id] });
  const updatedCat = await Observation.findOneAndUpdate(
    { _id: id },
    { specimen: _id, forReview: true },
    { new: true }
  );
  res.status(200).json(updatedCat);
});

export const removeIdentification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const found = await Observation.findById(id);
  if (!found) throw new ErrorResponse('Observation does not exist', 404);
  if (!found.specimen)
    throw new ErrorResponse('There is no active identification for this observation', 401);
  const updatedCat = await Observation.findOneAndUpdate(
    { _id: id },
    { $unset: { specimen: found.specimen }, forReview: false },
    { new: true }
  );
  await Specimen.findOneAndUpdate(
    { _id: found.specimen },
    { $pull: { matches: found._id } },
    { new: true }
  );
  await Specimen.deleteMany({ matches: { $size: 0 } });
  res.status(200).json(updatedCat);
});
