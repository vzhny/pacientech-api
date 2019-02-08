import database from '../db/database';

export const dropAllCollections = () => {
  database.connection.on('connected', () => {
    database.connection.dropCollection('users').catch(error => {
      const { message } = error;
      if (message !== 'ns not found') {
        console.log('Users collection not initialized.');
      }
    });

    database.connection.dropCollection('patients').catch(error => {
      const { message } = error;
      if (message !== 'ns not found') {
        console.log('Patients collection not initialized.');
      }
    });
  });
};

export const closeDatabaseConnection = () => {
  database.connection.close();
};
