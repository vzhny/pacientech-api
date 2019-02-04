import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const User = mongoose.model('User');

/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */

// POST register route controller
export const register = (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (password.length <= 6) {
    return res.status(400).json({
      message: 'Please enter a password with a length of 6 or more characters.',
    });
  }

  User.create(
    {
      firstName,
      lastName,
      email,
      password: bcrypt.hashSync(password, 10),
    },
    (error, user) => {
      if (error) {
        return res.status(400).json({
          message: 'There was an error registering, please try again.',
          error,
        });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 86400 });

      return res.status(201).json({
        auth: true,
        token,
      });
    }
  );
};

// POST login route controller
export const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).exec((error, user) => {
    if (error) {
      return res.status(400).json({
        message: 'There was an error logging in. Please try again.',
        error,
      });
    }

    if (!user) {
      return res.status(404).json({
        message: 'Could not find user or wrong password. Please try again.',
      });
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 86400 });

      return res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        auth: true,
        token,
      });
    }

    return res.status(404).json({
      message: 'Could not find user or wrong password. Please try again.',
    });
  });
};

// POST logout route controller
export const logout = (req, res) => {
  return res.status(200).json({
    auth: false,
    token: null,
  });
};
