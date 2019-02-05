import jwt from 'jsonwebtoken';

// eslint-disable-next-line
const verifyToken = (req, res, next) => {
  const token = req.headers.authentication;

  if (!token) {
    return res.status(403).json({
      auth: false,
      message: 'No authentication token was provided.',
    });
  }

  // eslint-disable-next-line
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(500).json({
        auth: false,
        message: 'Failed to authenticate the provided token.',
      });
    }

    req.userId = decoded.id;
  });

  return next();
};

export default verifyToken;
