import asyncHandler from '../middlewares/asyncHandler.js';

export const signUp = asyncHandler(async (req, res, next) => {
  throw new Error('error test');
});
