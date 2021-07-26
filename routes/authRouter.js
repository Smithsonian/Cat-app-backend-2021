import express from 'express';
import { signIn, createUser, approveSession } from '../controllers/authController.js';
import verifyToken from '../middlewares/verifyToken.js';
import isAdmin from '../middlewares/isAdmin.js';
import validateJOI from '../middlewares/validateJOI.js';
import { signUpBody, signInBody } from '../joi/schemas.js';

const authRouter = express.Router();

authRouter.post('/create-user', verifyToken, isAdmin, validateJOI(signUpBody), createUser);
authRouter.post('/signin', validateJOI(signInBody), signIn);
authRouter.get('/verify-session', verifyToken, approveSession);

export default authRouter;
