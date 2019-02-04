import request from 'supertest';
import { expect } from 'chai';
import app from '../server';
import database from '../db/database';

/* eslint-disable no-unused-expressions */

before(done => {
  database.connection.on('connected', () => {
    database.connection.dropCollection('users');
    console.log('  Successfully dropped the users collection.');
  });

  done();
});

describe('POST /api/auth/register', () => {
  it('should register a new user with a status of 201', done => {
    const userInformation = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@gmail.com',
      password: 'test1234',
    };

    request(app)
      .post('/api/auth/register')
      .send(userInformation)
      .then(res => {
        const { status } = res;

        expect(status).to.equal(201);

        done();
      });
  });

  it('should respond with an true auth flag and auth token after successfully registration', done => {
    const userInformation = {
      firstName: 'Sarah',
      lastName: 'Conner',
      email: 'sarah@gmail.com',
      password: 'test1234',
    };

    request(app)
      .post('/api/auth/register')
      .send(userInformation)
      .then(res => {
        const { body } = res;
        const { auth, token } = body;

        expect(auth).to.be.true;
        expect(token).to.be.a('string');

        done();
      });
  });

  it('should fail the registration of an email already in use', done => {
    const userInformation = {
      firstName: 'Harry',
      lastName: 'Stevens',
      email: 'john@gmail.com',
      password: 'test1234',
    };

    request(app)
      .post('/api/auth/register')
      .send(userInformation)
      .then(res => {
        const { status } = res;

        expect(status).to.equal(400);

        done();
      });
  });

  it('should enforce a password minimum length of 6 characters', done => {
    const userInformation = {
      firstName: 'Harry',
      lastName: 'Stevens',
      email: 'harry@gmail.com',
      password: 'weak',
    };

    request(app)
      .post('/api/auth/register')
      .send(userInformation)
      .then(res => {
        const { status, body } = res;
        const { message } = body;

        expect(status).to.equal(400);
        expect(message).to.equal('Please enter a password with a length of 6 or more characters.');

        done();
      });
  });
});
