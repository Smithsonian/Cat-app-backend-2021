import express from 'express';
import {
  signIn,
  createUser,
  approveSession,
  getUsers,
  toggleActive,
  toggleRole,
  changePassword
} from '../controllers/authController.js';
import verifyToken from '../middlewares/verifyToken.js';
import isAdmin from '../middlewares/isAdmin.js';
import validateJOI from '../middlewares/validateJOI.js';
import { signUpBody, signInBody } from '../joi/schemas.js';

const authRouter = express.Router();

authRouter.post('/create-user', verifyToken, isAdmin, validateJOI(signUpBody), createUser);
authRouter.patch('/status/:id', verifyToken, isAdmin, toggleActive);
authRouter.patch('/role/:id', verifyToken, isAdmin, toggleRole);
authRouter.patch('/password/:id', verifyToken, isAdmin, changePassword);
authRouter.post('/signin', validateJOI(signInBody), signIn);
authRouter.get('/users', verifyToken, isAdmin, getUsers);
authRouter.get('/verify-session', verifyToken, approveSession);

export default authRouter;
