import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';

export const signUp = asyncHandler(async (req, res, next) => {
  throw new ErrorResponse('error test', 404);
});
