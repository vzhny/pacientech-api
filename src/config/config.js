import {} from 'dotenv/config';

const env = process.env.NODE_ENV;

if (env === 'development') {
  process.env.MONGODB_URI = process.env.MLABS_MONGODB_URI_DEV;
  process.env.JWT_SECRET = process.env.JWT_SECRET_DEV;
  process.env.MONGODB_DB_NAME = process.env.MONGODB_DB_NAME_DEV;
} else if (env === 'test') {
  process.env.MONGODB_URI = process.env.MLABS_MONGODB_URI_TEST;
  process.env.JWT_SECRET = process.env.JWT_SECRET_TEST;
  process.env.MONGODB_DB_NAME = process.env.MONGODB_DB_NAME_TEST;
}
