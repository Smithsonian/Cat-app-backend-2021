import ErrorResponse from '../utils/ErrorResponse.js';

const isAdmin = async (req, res, next) => {
  try {
    const { role } = req.user;
    if (role === 'user') throw new ErrorResponse('Only an admin can create an user', 401);
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default isAdmin;
