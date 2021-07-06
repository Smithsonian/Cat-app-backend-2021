import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import User from '../models/User.js';

export const signUp = asyncHandler(async (req, res) => {
  const { name, role, email, password, active } = req.body;
  const foundUser = await User.findOne({ email });
  if (foundUser) throw new ErrorResponse('Email already taken', 403);
  const hashPassword = await bcrypt.hash(password, 5);
  const { _id, name: userName } = await User.create({ name, role, email, password: hashPassword, active });
  const token = jwt.sign({ _id, userName }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(201).json({ token });
});

export const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await User.findOne({ email }).select('+password');
  if (!foundUser) throw new ErrorResponse('User does not exist', 404);
  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) throw new ErrorResponse('Password is incorrect', 401);
  const token = jwt.sign({ _id: foundUser._id, userName: foundUser.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(201).json({ token });
});

export const approveSession = asyncHandler(async (req, res) => {
  res.json({ success: 'Valid token', user: req.user });
});
