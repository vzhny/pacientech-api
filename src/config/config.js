import { MONGODB_URI_DEV, MONGODB_URI_TEST, JWT_SECRET_DEV, JWT_SECRET_TEST } from 'babel-dotenv';

const env = process.env.NODE_ENV;

if (env === 'development') {
  process.env.MONGODB_URI = MONGODB_URI_DEV;
  process.env.JWT_SECRET = JWT_SECRET_DEV;
} else if (env === 'test') {
  process.env.MONGODB_URI = MONGODB_URI_TEST;
  process.env.JWT_SECRET = JWT_SECRET_TEST;
}
