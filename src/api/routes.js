import express from 'express';
import { register } from './controllers/auth-controllers';

const router = express.Router();

// POST register route
router.route('/auth/register').post(register);

export default router;
