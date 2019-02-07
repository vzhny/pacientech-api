import request from 'supertest';
import { expect } from 'chai';
import app from '../server';
import database from '../db/database';
import './localStorageSetup';

/* eslint-disable consistent-return */

before(done => {
  database.connection.on('connected', () => {
    // ! Workaround until a better solution to checking if the collection exists or not
    database.connection.dropCollection('users').catch(error => {
      const { message } = error;
      if (message !== 'ns not found') {
        return done();
      }
    });
    database.connection.dropCollection('patients').catch(error => {
      const { message } = error;
      if (message !== 'ns not found') {
        return done();
      }
    });
  });

  done();
});

describe('Server Tests', () => {
  describe('GET /', () => {
    it('should return a 200 status code', done => {
      request(app)
        .get('/')
        .then(res => {
          const { status } = res;

          expect(status).to.equal(200);

          done();
        })
        .catch(error => {
          const { message } = error;

          done(message);
        });
    });

    it('should send the correct message to check the documentation', done => {
      request(app)
        .get('/')
        .then(res => {
          const { text } = res;

          expect(text).to.equal(
            'Please go to https://github.com/vzhny/pacientech-api for API usage information.'
          );

          done();
        })
        .catch(error => {
          const { message } = error;

          done(message);
        });
    });
  });
});
