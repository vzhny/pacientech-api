import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
import shortid from 'shortid';

const Patient = mongoose.model('Patient');

/* eslint-disable consistent-return */

// GET patients/ route controller
export const getAllPatients = (req, res) => {
  Patient.find({
    createdBy: res.locals.userId,
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
  const { body } = req;

  const {
    name,
    address,
    phoneNumbers,
    email,
    lastVisit,
    reason,
    diagnosis,
    totalNumberOfSessions,
    notes,
    sessions,
  } = body;

  if (
    name === undefined ||
    null ||
    (address === undefined || null) ||
    (reason === undefined || null)
  ) {
    return res.status(400).json({
      message: 'Missing required field(s).',
    });
  }

  Patient.create(
    {
      patientId: shortid.generate(),
      name,
      address,
      phoneNumbers,
      email,
      lastVisit,
      reason,
      diagnosis,
      totalNumberOfSessions,
      notes,
      sessions,
      createdBy: new ObjectID(res.locals.userId),
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

// GET patients/:id route controller
export const getOnePatient = (req, res) => {
  const { patientId } = req.params;

  Patient.findOne({
    patientId,
    createdBy: res.locals.userId,
  }).exec((error, patient) => {
    if (error) {
      return res.status(500).json({
        message: 'There was a problem retrieving the entered patient from the database.',
        error,
      });
    }

    if (!patient) {
      return res.status(404).json({
        message: `Could not find/ no patient with ID ${patientId}`,
      });
    }

    return res.status(200).json(patient);
  });
};

// PUT patients/:id route controller
export const updateOnePatient = (req, res) => {
  const { patientId } = req.params;

  const updatedInformation = {
    address: req.body.address,
    phoneNumbers: req.body.phoneNumbers,
    email: req.body.email,
    lastVisit: req.body.lastVisit,
    reason: req.body.reason,
    diagnosis: req.body.diagnosis,
    totalNumberOfSessions: req.body.totalNumberOfSessions,
    notes: req.body.notes,
    sessions: req.body.sessions,
  };

  Patient.findOneAndUpdate(
    {
      patientId,
      createdBy: res.locals.userId,
    },
    updatedInformation
  ).exec((error, patient) => {
    if (error) {
      return res.status(500).json({
        message: 'There was an error editing the patient.',
        error,
      });
    }

    if (!patient) {
      return res.status(404).json({
        message: `Could not find/ no patient with ID ${patientId}`,
      });
    }

    return res.status(204).json();
  });
};

// DELETE patients/:id route controller
export const deleteOnePatient = (req, res) => {
  const { patientId } = req.params;

  Patient.findOneAndDelete({
    patientId,
    createdBy: res.locals.userId,
  }).exec((err, patient) => {
    if (err) {
      return res.status(500).json({
        message: 'There was an error deleting the patient.',
        err,
      });
    }

    if (!patient) {
      return res.status(404).json({
        message: `Could not find/ no patient with ID ${patientId}`,
      });
    }

    return res.status(204).json();
  });
};
