import mongoose from 'mongoose';
import shortid from 'shortid';
import { ObjectID } from 'mongodb';

const Patient = mongoose.model('Patient');

// GET patients route controller
// eslint-disable-next-line
export const getAllPatients = (req, res) => {
  Patient.find({
    createdBy: req.userId,
  }).exec((error, patients) => {
    if (error) {
      return res.status(500).json({
        message: 'Problem retrieving patients from the database. Please try again later.',
        error,
      });
    }

    return res.status(200).json(patients);
  });
};

// POST patients/ route controller
export const addOnePatient = (req, res) => {
  Patient.create(
    {
      name: req.body.name,
      address: req.body.address,
      phoneNumbers: req.body.phoneNumbers,
      email: req.body.email,
      lastVisit: req.body.lastVisit,
      reason: req.body.reason,
      diagnosis: req.body.diagnosis,
      totalNumberOfSessions: req.body.totalNumberOfSessions,
      notes: req.body.notes,
      sessions: req.body.sessions,
      createdBy: new ObjectID(req.userId),
    },
    (error, patient) => {
      if (error) {
        return res.status(400).json({
          message: 'There was an error creating the patient. Please try again.',
          error,
        });
      }

      return res.status(201).json(patient);
    }
  );
};
