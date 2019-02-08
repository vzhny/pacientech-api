import request from 'supertest';
import app from '../app';
import server from '../server';
import {
  patientOneInformation,
  patientTwoInformation,
  incompletePatientInformation,
} from './mock/patients';
import { closeDatabaseConnection } from './databaseSetup';

/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

const patientTests = () => {
  afterAll(async () => {
    closeDatabaseConnection();
    await server.close();
  });

  let firstAuthToken;
  let secondAuthToken;
  let patientOneId;
  let patientTwoId;

  const firstValidAuthTokenUser = request.agent(app);
  const secondValidAuthTokenUser = request.agent(app);
  const invalidAuthTokenUser = request.agent(app);
  const noAuthTokenUser = request.agent(app);

  describe('POST /api/auth/login (auth token retrieval)', () => {
    it('should log an existing user successfully (first user)', done => {
      const firstUserInformation = {
        email: 'john_doe@gmail.com',
        password: 'test1234',
      };

      firstValidAuthTokenUser
        .post('/api/auth/login')
        .send(firstUserInformation)
        .then(res => {
          const { status, body } = res;
          const { firstName, lastName, auth, token } = body;

          expect(status).toEqual(200);
          expect(firstName).toEqual('John');
          expect(lastName).toEqual('Doe');
          expect(auth).toBeTruthy();
          expect(token).toBeTruthy();

          firstAuthToken = token;

          done();
        })
        .catch(error => {
          const { message } = error;
          done(message);
        });
    });

    it('should log an existing user successfully (second user)', done => {
      const secondUserInformation = {
        email: 'sarah_conner@gmail.com',
        password: '1234test',
      };

      secondValidAuthTokenUser
        .post('/api/auth/login')
        .send(secondUserInformation)
        .then(res => {
          const { status, body } = res;
          const { firstName, lastName, auth, token } = body;

          expect(status).toEqual(200);
          expect(firstName).toEqual('Sarah');
          expect(lastName).toEqual('Conner');
          expect(auth).toBeTruthy();
          expect(token).toBeTruthy();

          secondAuthToken = token;

          done();
        })
        .catch(error => {
          const { message } = error;
          done(message);
        });
    });
  });

  describe('POST /api/patients', () => {
    it('should add one single patient successfully if a valid auth token is provided (first user)', done => {
      firstValidAuthTokenUser
        .post('/api/patients')
        .set('authentication', firstAuthToken)
        .send(patientOneInformation)
        .then(res => {
          const { status, body } = res;
          const { patientId: firstId } = body;

          expect(status).toEqual(201);
          expect(body).toMatchObject(patientOneInformation);

          patientOneId = firstId;

          done();
        })
        .catch(error => {
          const { message } = error;

          done(new Error(message));
        });
    });

    it('should add one single patient successfully if a valid auth token is provided (second user)', done => {
      secondValidAuthTokenUser
        .post('/api/patients')
        .set('authentication', secondAuthToken)
        .send(patientTwoInformation)
        .then(res => {
          const { status, body } = res;
          const { patientId: secondId } = body;

          expect(status).toEqual(201);
          expect(body).toMatchObject(patientTwoInformation);

          patientTwoId = secondId;

          done();
        })
        .catch(error => {
          const { message } = error;

          done(new Error(message));
        });
    });

    it('should show an error message if one or more required fields are missing', done => {
      firstValidAuthTokenUser
        .post('/api/patients')
        .set('authentication', firstAuthToken)
        .send(incompletePatientInformation)
        .then(res => {
          const { status, body } = res;
          const { message } = body;

          expect(status).toEqual(400);
          expect(message).toEqual('Missing required field(s).');

          done();
        })
        .catch(error => {
          const { message } = error;

          done(new Error(message));
        });
    });

    it('should not add the patient and show an error message if an invalid auth token is provided', done => {
      invalidAuthTokenUser
        .post('/api/patients')
        .set('authentication', 'invalid_auth_token')
        .send(patientOneInformation)
        .then(res => {
          const { status, body } = res;
          const { auth, message } = body;

          expect(status).toEqual(500);
          expect(auth).toBeFalsy();
          expect(message).toEqual('Failed to authenticate the provided token.');

          done();
        })
        .catch(error => {
          const { message } = error;

          done(new Error(message));
        });
    });

    it('should not add the patient and show an error message if no auth token is provided', done => {
      noAuthTokenUser
        .post('/api/patients')
        .send(patientOneInformation)
        .then(res => {
          const { status, body } = res;
          const { auth, message } = body;

          expect(status).toEqual(403);
          expect(auth).toBeFalsy();
          expect(message).toEqual('No authentication token was provided.');

          done();
        })
        .catch(error => {
          const { message } = error;

          done(new Error(message));
        });
    });
  });

  describe('GET /api/patients', () => {
    it('should retrieve all patients created by the user if a valid auth token is provided', done => {
      firstValidAuthTokenUser
        .get('/api/patients')
        .set('authentication', firstAuthToken)
        .then(res => {
          const { status, body } = res;

          expect(status).toEqual(200);
          expect(body).toHaveLength(1);

          done();
        })
        .catch(error => {
          const { message } = error;

          done(new Error(message));
        });
    });
  });

  describe('GET /api/patients/:patientId', () => {
    it('should successfully retrieve the correct patient given their ID and valid auth token (first user)', done => {
      firstValidAuthTokenUser
        .get(`/api/patients/${patientOneId}`)
        .set('authentication', firstAuthToken)
        .then(res => {
          const { status, body } = res;
          const { patientId } = body;

          expect(status).toEqual(200);
          expect(body).toMatchObject(patientOneInformation);
          expect(patientId).toEqual(patientOneId);

          done();
        })
        .catch(error => {
          const { message } = error;

          done(new Error(message));
        });
    });

    it('should successfully retrieve the correct patient given their ID and valid auth token (second user)', done => {
      secondValidAuthTokenUser
        .get(`/api/patients/${patientTwoId}`)
        .set('authentication', secondAuthToken)
        .then(res => {
          const { status, body } = res;
          const { patientId } = body;

          expect(status).toEqual(200);
          expect(body).toMatchObject(patientTwoInformation);
          expect(patientId).toEqual(patientTwoId);

          done();
        })
        .catch(error => {
          const { message } = error;

          done(new Error(message));
        });
    });

    it('should return an error message if the patient ID is not found', done => {
      const invalidPatientId = 'invalid-id';

      firstValidAuthTokenUser
        .get(`/api/patients/${invalidPatientId}`)
        .set('authentication', firstAuthToken)
        .then(res => {
          const { status, body } = res;
          const { message } = body;

          expect(status).toEqual(404);
          expect(message).toEqual(`Could not find/ no patient with ID ${invalidPatientId}`);

          done();
        })
        .catch(error => {
          const { message } = error;

          done(new Error(message));
        });
    });

    it('should not retrieve any patients that are were not created by the user', done => {
      firstValidAuthTokenUser
        .get(`/api/patients/${patientTwoId}`)
        .set('authentication', firstAuthToken)
        .then(res => {
          const { status, body } = res;
          const { message } = body;
          expect(status).toEqual(404);
          expect(message).toEqual(`Could not find/ no patient with ID ${patientTwoId}`);

          done();
        })
        .catch(error => {
          const { message } = error;

          done(new Error(message));
        });
    });
  });

  describe('PUT /api/patients/:patientId', () => {
    it('should successfully update the correct patient given their ID and valid auth token', done => {
      const updatedPatient = {
        ...patientOneInformation,
        notes: 'Updated notes!',
      };

      firstValidAuthTokenUser
        .put(`/api/patients/${patientOneId}`)
        .set('authentication', firstAuthToken)
        .send(updatedPatient)
        .then(res => {
          const { status } = res;

          expect(status).toEqual(204);

          done();
        })
        .catch(error => {
          const { message } = error;

          done(new Error(message));
        });
    });

    it('should not edit any patients that are were not created by the user', done => {
      firstValidAuthTokenUser
        .put(`/api/patients/${patientTwoId}`)
        .set('authentication', firstAuthToken)
        .then(res => {
          const { status, body } = res;
          const { message } = body;

          expect(status).toEqual(404);
          expect(message).toEqual(`Could not find/ no patient with ID ${patientTwoId}`);

          done();
        })
        .catch(error => {
          const { message } = error;

          done(new Error(message));
        });
    });
  });

  describe('DELETE /api/patients/:patientId', () => {
    it('should successfully delete the correct patient given their ID and valid auth token', done => {
      firstValidAuthTokenUser
        .delete(`/api/patients/${patientOneId}`)
        .set('authentication', firstAuthToken)
        .then(res => {
          const { status } = res;

          expect(status).toEqual(204);

          done();
        })
        .catch(error => {
          const { message } = error;

          done(new Error(message));
        });
    });

    it('should not delete any patients that are were not created by the user', done => {
      firstValidAuthTokenUser
        .delete(`/api/patients/${patientTwoId}`)
        .set('authentication', firstAuthToken)
        .then(res => {
          const { status, body } = res;
          const { message } = body;

          expect(status).toEqual(404);
          expect(message).toEqual(`Could not find/ no patient with ID ${patientTwoId}`);

          done();
        })
        .catch(error => {
          const { message } = error;

          done(new Error(message));
        });
    });
  });
};

export default patientTests;
