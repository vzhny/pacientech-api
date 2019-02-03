import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const User = mongoose.model('User');

// POST register route controller
// eslint-disable-next-line
export const register = (req, res) => {
  const { firstName, lastName, email, password } = req.body;

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
        });
      }

      // If there is no error, sign a token, send a 201 and enable auth with the token.
      // The token expires in 24 hours.
      // eslint-disable-next-line
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
      });
    }

    if (!user) {
      return res.status(404).json({
        message: 'Could not find user or wrong password. Please try again.',
      });
    }

    if (bcrypt.compareSync(password, user.password)) {
      // eslint-disable-next-line
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 86400 });

      return res.status(200).json({
        auth: true,
        token,
      });
    }

    return res.status(401).json({
      message: 'Could not find user or wrong password. Please try again.',
    });
  });
};
