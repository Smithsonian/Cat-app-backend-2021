import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ErrorResponse from '../utils/ErrorResponse.js';

const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) throw new ErrorResponse('Unauthorized', 401);
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    const foundUser = await User.findOne({ _id });
    if (!foundUser) throw new ErrorResponse('User does not exist', 404);
    if (!foundUser.active) throw new ErrorResponse('User is not authorized to use the app', 401);
    req.user = foundUser;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default verifyToken;
