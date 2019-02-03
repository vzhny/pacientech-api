import mongoose from 'mongoose';
import '../models/user.model';

console.log(`Mongoose is attempting to connect to ${process.env.MONGODB_URI}.`);

const database = mongoose;

// Initial database connection attempt
database.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
});

// Listening for the connection to the database
database.connection.on('connected', () => {
  console.log(`Mongoose connected to ${process.env.MONGODB_URI}`);
});

// Listening for the disconnection from the database
database.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Listening for any errors from the database
database.connection.on('error', err => {
  console.log('Mongoose connection error:', err);
});

// Mongoose helper functions to listen to process events from the app
// Listening for ctrl+c app termination from terminal
process.on('SIGINT', () => {
  database.connection.close(() => {
    console.log('Mongoose disconnected through app termination (SIGINT)');
    process.exit(0);
  });
});

// Listening for app termination from heroku
process.on('SIGTERM', () => {
  database.connection.close(() => {
    console.log('Mongoose disconnected through app termination (SIGTERM)');
    process.exit(0);
  });
});

// Listening (once) for nodemon restart
process.once('SIGUSR2', () => {
  database.connection.close(() => {
    console.log('Mongoose disconnected through app termination (SIGUSR2)');
    process.kill(process.pid, 'SIGUSR2');
  });
});

export default database;