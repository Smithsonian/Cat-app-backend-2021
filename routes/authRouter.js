import express from 'express';
import { signUp } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.get('/', signUp);

export default authRouter;
