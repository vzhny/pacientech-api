import express from 'express';
import { register, login, logout } from './controllers/auth-controllers';
import {
  getAllPatients,
  addOnePatient,
  getOnePatient,
  updateOnePatient,
} from './controllers/patient-controllers';
import verifyToken from '../auth/verify-token';

const router = express.Router();

// GET and POST patients routes
router
  .route('/patients')
  .get(verifyToken, getAllPatients)
  .post(verifyToken, addOnePatient);

// GET, PUT, and DELETE patients/:id routes
router
  .route('/patients/:patientId')
  .get(verifyToken, getOnePatient)
  .put(verifyToken, updateOnePatient);

// POST register route
router.route('/auth/register').post(register);

// POST login route
router.route('/auth/login').post(login);

// POST (explicit) logout route
router.route('/auth/logout').post(logout);

export default router;
