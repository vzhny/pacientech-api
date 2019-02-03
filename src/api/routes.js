import express from 'express';
import { register, login } from './controllers/auth-controllers';

const router = express.Router();

// POST register route
router.route('/auth/register').post(register);

// POST login route
router.route('/auth/login').post(login);

export default router;
