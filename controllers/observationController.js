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

export const getCounters = asyncHandler(async (req, res) => {
  const deployments = await Observation.distinct('deployment_id');
  const total = await Observation.countDocuments();
  const forReview = await Observation.countDocuments({ forReview: true });
  const notCat = await Observation.countDocuments({ isCat: false });
  res.status(200).json({ counters: { deployments: deployments.length, total, forReview, notCat } });
});

export const getCandidates = asyncHandler(async (req, res) => {
  const { coordinates, distance, ...params } = req.body;
  const matchingCriteria = [];
  for (const param in params) {
    if (params[param] !== 'Unknown') {
      matchingCriteria.push({
        $or: [
          { [`observations.${param}`]: params[param] },
          { [`observations.${param}`]: 'Unknown' }
        ]
      });
    }
  }
  if (!matchingCriteria.length) {
    const defaultFilter = [
      { 'observations.pattern': 'Unknown' },
      { 'observations.bicolor': 'Unknown' },
      { 'observations.longHair': 'Unknown' }
    ];
    defaultFilter.forEach(filter => matchingCriteria.push(filter));
  }
  const pipeline = [
    {
      $lookup: {
        from: 'observations',
        localField: 'matches',
        foreignField: '_id',
        as: 'observations'
      }
    },
    {
      $match: {
        $and: matchingCriteria,
        'observations.location': {
          $geoWithin: {
            $centerSphere: [coordinates, Number(distance) / 6378.1]
          }
        }
      }
    },
    { $unset: ['matches'] }
  ];
  const candidates = await Specimen.aggregate(pipeline);
  res.status(200).json(candidates);
});

export const getObservations = asyncHandler(async (req, res) => {
  const { role } = req.user;
  const { minLon, maxLon, minLat, maxLat, date_time_original, project_id, deployment_id } =
    req.body;
  const reqBody = { ...req.body };
  const removeFields = [
    'minLon',
    'maxLon',
    'minLat',
    'maxLat',
    'date_time_original',
    'project_id',
    'deployment_id'
  ];
  removeFields.forEach(param => delete reqBody[param]);
  const rawQuery = JSON.parse(
    JSON.stringify(reqBody).replace(
      /\b(gt|gte|lt|lte|in|exists|geoWithin|centerSphere)\b/g,
      match => `$${match}`
    )
  );
  let query = {};
  const arrayOfQueryParams = [];
  for (const param in rawQuery) {
    if (rawQuery[param] !== 'Unknown') {
      arrayOfQueryParams.push({ [param]: rawQuery[param] });
    }
  }

  if (arrayOfQueryParams.length !== 0) {
    query = { $and: arrayOfQueryParams };
  }

  if (project_id) {
    query = { ...query, project_id };
  }

  if (deployment_id) {
    query = { ...query, deployment_id };
  }

  if (date_time_original) {
    for (const param in date_time_original) {
      date_time_original[`$${param}`] = date_time_original[param];
      delete date_time_original[param];
    }
    query = { ...query, date_time_original };
  }

  if (role === 'user') {
    query = { ...query, isCat: true, notID: false };
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

    query = { ...query, ...geo };
  }
  const observations = await Observation.find(query);
  res.status(200).json({ observations });
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
    { specimen: _id },
    { new: true }
  );
  res.status(200).json(updatedCat);
});

export const addObservationToCat = asyncHandler(async (req, res) => {
  const { catId, observationId } = req.params;
  const cat = await Specimen.findById(catId);
  if (!cat) throw new ErrorResponse('Cat does not exist', 404);
  const observation = await Observation.findById(observationId);
  if (!observation) throw new ErrorResponse('Observation does not exist', 404);
  await cat.update({ $addToSet: { matches: observationId } });
  await cat.save();
  const updatedObservation = await Observation.findOneAndUpdate(
    { _id: observationId },
    { specimen: cat._id },
    { new: true }
  );
  res.status(200).json(updatedObservation);
});

export const removeIdentification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const found = await Observation.findById(id);
  if (!found) throw new ErrorResponse('Observation does not exist', 404);
  if (!found.specimen)
    throw new ErrorResponse('There is no active identification for this observation', 401);
  const updatedCat = await Observation.findOneAndUpdate(
    { _id: id },
    { $unset: { specimen: found.specimen }, reasonReview: 'None' },
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
