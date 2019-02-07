import jwt from 'jsonwebtoken';

/* eslint-disable consistent-return */

const verifyToken = (req, res, next) => {
  const token = req.headers.authentication;
  // Adding an error flag to prevent the following error:
  // Uncaught Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
  let didNotEncounterError = true;

  if (!token) {
    didNotEncounterError = false;

    return res.status(403).json({
      auth: false,
      message: 'No authentication token was provided.',
    });
  }

  // eslint-disable-next-line
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      didNotEncounterError = false;

      return res.status(500).json({
        auth: false,
        message: 'Failed to authenticate the provided token.',
      });
    }

    res.locals.userId = decoded.id;
  });

  if (didNotEncounterError) {
    return next();
  }
};

export default verifyToken;
