import mongoose from 'mongoose';
import shortid from 'shortid';
import isEmail from 'validator/lib/isEmail';
import moment from 'moment';

const sessionSchema = new mongoose.Schema({
  number: {
    type: Number,
    default: 1,
  },
  date: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
});

const phoneNumbersSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
});

const patientSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate(),
  },
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumbers: {
    type: [phoneNumbersSchema],
  },
  email: {
    type: String,
    validate: {
      isAsync: false,
      validator: isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  lastVisit: {
    type: String,
    default: moment(Date.now()).format('MM/DD/YY'),
  },
  reason: {
    type: String,
    required: true,
  },
  diagnosis: {
    type: String,
  },
  totalNumberOfSessions: {
    type: Number,
    default: 1,
  },
  notes: {
    type: String,
  },
  sessions: {
    type: [sessionSchema],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

mongoose.model('Patient', patientSchema);
