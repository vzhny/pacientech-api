import mongoose from 'mongoose';
import shortid from 'shortid';
import { ObjectID } from 'mongodb';

const Patient = mongoose.model('Patient');

/* eslint-disable consistent-return */

// GET patients/ route controller
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
  const { body, userId } = req;

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

  if (name === undefined || null) {
    return res.status(400).json({
      message: 'Missing the required name field.',
    });
  }

  Patient.create(
    {
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
      createdBy: new ObjectID(userId),
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

  if (!shortid.isValid(patientId)) {
    return res.status(400).json({
      message: `${patientId} is not a valid patient ID.`,
    });
  }

  Patient.findOne({
    _id: patientId,
    createdBy: req.userId,
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
  // Retrieve the patientId from the url
  const { patientId } = req.params;

  if (!shortid.isValid(patientId)) {
    return res.status(400).json({
      message: `${patientId} is not a valid patient ID.`,
    });
  }

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
      _id: patientId,
      createdBy: req.userId,
    },
    updatedInformation
  ).exec((error, patient) => {
    if (error) {
      return res.status(500).json({
        message: 'There was an error finding the patient.',
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

  if (!shortid.isValid(patientId)) {
    return res.status(400).json({
      message: `${patientId} is not a valid patient ID.`,
    });
  }

  Patient.findOneAndDelete({
    _id: patientId,
    createdBy: req.userId,
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
