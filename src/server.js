import './config/config';
import express from 'express';
import morgan from 'morgan';
import timestamp from 'time-stamp';
import helmet from 'helmet';
import cors from 'cors';
import database from './db/database'; // eslint-disable-line
import routes from './api/routes';

const app = express();
const port = process.env.PORT || 3000;

// * Express Middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(
    morgan(
      `${timestamp(
        'MM/DD/YYYY HH:mm:ss'
      )} :method :url :status :res[content-length] - :response-time ms`
    )
  );
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());

// * API routes
app.use('/api', routes);

// * (Temporary) Heroku Wakeup Route
app.get('/', (req, res) => {
  const message = 'Please go to https://github.com/vzhny/pacientech-api for API usage information.';
  res.status(200).send(message);
});

app.listen(port, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Server listening on port ${port}!`);
  }
});

export default app;
