import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pkg from 'generate-password';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import transporter from '../utils/Mailer.js';
import User from '../models/User.js';
const { generate } = pkg;

export const createUser = asyncHandler(async (req, res) => {
  const { name, role, email, active } = req.body;
  const foundUser = await User.findOne({ email });
  if (foundUser) throw new ErrorResponse('Email already taken', 403);
  const password = generate({
    length: 10,
    numbers: true
  });
  const hashPassword = await bcrypt.hash(password, 5);
  const newUser = await User.create({
    name,
    role,
    email,
    password: hashPassword,
    active
  });
  const mailOptions = {
    from: process.env.STMP_USER,
    to: email,
    subject: `Your new user for ${process.env.APP_NAME}`,
    html: `<div>Hello, ${name}.</br> An user account for <a href='${process.env.APP_URL}' target='_blank' rel=“noopener noreferrer“>${process.env.APP_NAME}</a> was created for you.</br></br>Your username is your email and the password is: ${password}</div>`
  };
  await transporter.sendMail(mailOptions);
  res.status(201).json({
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      active: newUser.active
    }
  });
});

export const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await User.findOne({ email }).select('+password');
  if (!foundUser) throw new ErrorResponse('User does not exist', 404);
  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) throw new ErrorResponse('Password is incorrect', 401);
  const token = jwt.sign({ _id: foundUser._id, userName: foundUser.name }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
  res.status(201).json({ token });
});

export const approveSession = asyncHandler(async (req, res) => {
  res.json({ success: 'Valid token', user: req.user });
});
