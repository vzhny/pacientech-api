import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    maxlength: 15,
    required: true,
  },
  lastName: {
    type: String,
    maxlength: 15,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    validate: {
      isAsync: false,
      validator: isEmail,
      message: '{VALUE} is not a valid email.',
    },
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

mongoose.model('User', userSchema);
