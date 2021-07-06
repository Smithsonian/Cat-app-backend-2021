import express from 'express';
import { signIn, signUp, approveSession } from '../controllers/authController.js';
import verifyToken from '../middlewares/verifyToken.js';
import validateJOI from '../middlewares/validateJOI.js';
import { signUpBody, signInBody } from '../joi/schemas.js';

const authRouter = express.Router();

authRouter.use(express.json());

authRouter.post('/signup', validateJOI(signUpBody), signUp);
authRouter.post('/signin', validateJOI(signInBody), signIn);
authRouter.get('/verify-session', verifyToken, approveSession);

export default authRouter;
