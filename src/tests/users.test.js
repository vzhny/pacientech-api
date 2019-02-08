import request from 'supertest';
import app from '../app';

/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

const userTests = () => {
  let firstAuthToken = '';
  let secondAuthToken = '';

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully (first user)', done => {
      const userInformation = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john_doe@gmail.com',
        password: 'test1234',
      };

      request(app)
        .post('/api/auth/register')
        .send(userInformation)
        .then(res => {
          const { status, body } = res;
          const { auth, token } = body;

          expect(status).toEqual(201);
          expect(auth).toBeTruthy();
          expect(token).toBeTruthy();

          firstAuthToken = token;
          localStorage.setItem('firstAuthToken', token);

          done();
        })
        .catch(error => {
          const { message } = error;

          done(message);
        });
    });

    it('should register a new user successfully (second  user)', done => {
      const userInformation = {
        firstName: 'Sarah',
        lastName: 'Conner',
        email: 'sarah_conner@gmail.com',
        password: '1234test',
      };

      request(app)
        .post('/api/auth/register')
        .send(userInformation)
        .then(res => {
          const { status, body } = res;
          const { firstName, lastName, auth, token } = body;

          expect(status).toEqual(201);
          expect(firstName).toEqual('Sarah');
          expect(lastName).toEqual('Conner');
          expect(auth).toBeTruthy();
          expect(token).toBeTruthy();

          secondAuthToken = token;
          localStorage.setItem('secondAuthToken', token);

          done();
        })
        .catch(error => {
          const { message } = error;

          done(message);
        });
    });

    it('should make sure that both auth tokens are different', done => {
      // This test is temporary -- using it to debug why two other tests are failing.
      try {
        expect(firstAuthToken).not.toEqual(secondAuthToken);

        done();
      } catch (error) {
        const { message } = error;

        done(message);
      }
    });

    it('should fail the registration of an email already in use', done => {
      const userInformation = {
        firstName: 'Harry',
        lastName: 'Stevens',
        email: 'john_doe@gmail.com',
        password: 'test1234',
      };

      request(app)
        .post('/api/auth/register')
        .send(userInformation)
        .then(res => {
          const { status } = res;

          expect(status).toEqual(400);

          done();
        })
        .catch(error => {
          const { message } = error;

          done(message);
        });
    });

    it('should enforce a password minimum length of 6 characters', done => {
      const userInformation = {
        firstName: 'Harry',
        lastName: 'Stevens',
        email: 'harry_stevens@gmail.com',
        password: 'weak',
      };

      request(app)
        .post('/api/auth/register')
        .send(userInformation)
        .then(res => {
          const { status, body } = res;
          const { message } = body;

          expect(status).toEqual(400);
          expect(message).toEqual('Please enter a password with a length of 6 or more characters.');

          done();
        })
        .catch(error => {
          const { message } = error;

          done(message);
        });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should log in an existing user successfully', done => {
      const userInformation = {
        email: 'john_doe@gmail.com',
        password: 'test1234',
      };

      request(app)
        .post('/api/auth/login')
        .send(userInformation)
        .then(res => {
          const { status } = res;

          expect(status).toEqual(200);

          done();
        })
        .catch(error => {
          const { message } = error;

          done(message);
        });
    });

    it("should respond with the user's first and last names, a true auth flag and auth token after successfully logging in", done => {
      const userInformation = {
        email: 'john_doe@gmail.com',
        password: 'test1234',
      };

      request(app)
        .post('/api/auth/login')
        .send(userInformation)
        .then(res => {
          const { body } = res;
          const { firstName, lastName, auth, token } = body;

          expect(firstName).toEqual('John');
          expect(lastName).toEqual('Doe');
          expect(auth).toBeTruthy();
          expect(token).toBeTruthy();

          done();
        })
        .catch(error => {
          const { message } = error;

          done(message);
        });
    });

    it('should respond with a general error message when an unregistered email address is entered', done => {
      const userInformation = {
        email: 'steve@gmail.com',
        password: 'non-registered',
      };

      request(app)
        .post('/api/auth/login')
        .send(userInformation)
        .then(res => {
          const { status, body } = res;
          const { message } = body;

          expect(status).toEqual(404);
          expect(message).toEqual('Could not find user or wrong password. Please try again.');

          done();
        })
        .catch(error => {
          const { message } = error;

          done(message);
        });
    });

    it('should respond with a general error message when an incorrect password is entered', done => {
      const userInformation = {
        email: 'john_doe@gmail.com',
        password: '1234test',
      };

      request(app)
        .post('/api/auth/login')
        .send(userInformation)
        .then(res => {
          const { status, body } = res;
          const { message } = body;

          expect(status).toEqual(404);
          expect(message).toEqual('Could not find user or wrong password. Please try again.');

          done();
        })
        .catch(error => {
          const { message } = error;

          done(message);
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

          expect(status).toEqual(200);
          expect(auth).toBeFalsy();
          expect(token).toBeNull();

          done();
        })
        .catch(error => {
          const { message } = error;

          done(message);
        });
    });
  });
};

export default userTests;
