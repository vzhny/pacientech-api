import express from 'express';
import { register, login, logout } from './controllers/auth-controllers';

const router = express.Router();

// POST register route
router.route('/auth/register').post(register);

// POST login route
router.route('/auth/login').post(login);

// POST (explicit) logout route
router.route('/auth/logout').post(logout);

export default router;
