import request from 'supertest';
import { expect } from 'chai';
import app from '../server';

/* eslint-disable no-unused-expressions */

describe('POST /api/auth/register', () => {
  it('should register a new user successfully', done => {
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

  it('should respond with an true auth flag and auth token after successful registration', done => {
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

describe('POST /api/auth/login', () => {
  it('should log in an existing user successfully', done => {
    const userInformation = {
      email: 'john@gmail.com',
      password: 'test1234',
    };

    request(app)
      .post('/api/auth/login')
      .send(userInformation)
      .then(res => {
        const { status } = res;

        expect(status).to.equal(200);

        done();
      });
  });

  it("should respond with the user's first and last names, a true auth flag and auth token after successfully logging in", done => {
    const userInformation = {
      email: 'john@gmail.com',
      password: 'test1234',
    };

    request(app)
      .post('/api/auth/login')
      .send(userInformation)
      .then(res => {
        const { body } = res;
        const { firstName, lastName, auth, token } = body;

        expect(firstName).to.equal('John');
        expect(lastName).to.equal('Doe');
        expect(auth).to.be.true;
        expect(token).to.be.a('string');

        done();
      });
  });

  it('should respond with a general error message when an unregistered email address is entered', done => {
    const userInformation = {
      email: 'steve@gmail.com',
      password: 'test1234',
    };

    request(app)
      .post('/api/auth/login')
      .send(userInformation)
      .then(res => {
        const { status, body } = res;
        const { message } = body;

        expect(status).to.equal(404);
        expect(message).to.equal('Could not find user or wrong password. Please try again.');

        done();
      });
  });

  it('should respond with a general error message when an incorrect password is entered', done => {
    const userInformation = {
      email: 'john@gmail.com',
      password: '1234test',
    };

    request(app)
      .post('/api/auth/login')
      .send(userInformation)
      .then(res => {
        const { status, body } = res;
        const { message } = body;

        expect(status).to.equal(404);
        expect(message).to.equal('Could not find user or wrong password. Please try again.');

        done();
      });
  });
});

describe('POST api/auth/logout', () => {
  it('should respond with a false auth flag and null auth token', done => {
    request(app)
      .post('/api/auth/logout')
      .then(res => {
        const { status, body } = res;
        const { auth, token } = body;

        expect(status).to.equal(200);
        expect(auth).to.be.false;
        expect(token).to.be.null;

        done();
      });
  });
});
