import request from 'supertest';
import { expect } from 'chai';
import app from '../server';

/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

const firstAuthToken = localStorage.getItem('firstAuthToken');
const secondAuthToken = localStorage.getItem('secondAuthToken');

const firstValidAuthTokenUser = request.agent(app);
const secondValidAuthTokenUser = request.agent(app);
const invalidAuthTokenUser = request.agent(app);
const noAuthTokenUser = request.agent(app);

const patientOneInformation = {
  name: 'Gilda Shields',
  address: '9914 Maia Locks',
  phoneNumbers: [
    { type: 'cell', number: '111-111-1111' },
    { type: 'home', number: '222-222-2222' },
  ],
  email: 'gilda@gmail.com',
  lastVisit: '02/04/19',
  reason: 'Foot pain',
  diagnosis: 'Stubbed toe',
  totalNumberOfSessions: 1,
  notes: 'N/A',
  sessions: [
    {
      number: 1,
      date: '02/04/19',
      notes: 'N/A',
      confirmed: true,
    },
  ],
};

const patientTwoInformation = {
  name: 'Barrett Hilpert',
  address: '269 Tillman Court',
  phoneNumbers: [{ type: 'cell', number: '333-333-3333' }],
  email: 'barrett@gmail.com',
  lastVisit: '02/05/19',
  reason: 'Hurt back while exercising',
  diagnosis: 'Strained muscle',
  totalNumberOfSessions: 2,
  notes: 'Wear a lifting belt',
  sessions: [
    {
      number: 1,
      date: '02/04/19',
      notes: 'N/A',
      confirmed: true,
    },
    {
      number: 2,
      date: '02/05/19',
      notes: 'N/A',
      confirmed: true,
    },
  ],
};

const incompletePatientInformation = {
  phoneNumbers: [{ type: 'cell', number: '444-444-4444' }],
  email: 'barrett@gmail.com',
  lastVisit: '02/05/19',
  diagnosis: 'Headaches',
  totalNumberOfSessions: 1,
  notes: 'Take baby aspirin',
  sessions: [
    {
      number: 1,
      date: '02/04/19',
      notes: 'Working too much',
      confirmed: true,
    },
  ],
};

const patientObjectKeys = [
  '_id',
  'patientId',
  'name',
  'address',
  'phoneNumbers',
  'email',
  'lastVisit',
  'reason',
  'diagnosis',
  'totalNumberOfSessions',
  'notes',
  'sessions',
  'createdBy',
  '__v',
];

let patientOneId = '';
let patientTwoId = '';

describe('Patient Tests', () => {
  describe('POST /api/patients', () => {
    it('should add one single patient successfully if a valid auth token is provided (first user)', done => {
      firstValidAuthTokenUser
        .post('/api/patients')
        .set('authentication', firstAuthToken)
        .send(patientOneInformation)
        .then(res => {
          const { status, body } = res;
          const { name, patientId: firstId } = body;

          expect(status).to.equal(201);
          expect(body).to.be.an('object');
          expect(body).to.have.all.keys(patientObjectKeys);
          expect(name).to.equal('Gilda Shields');
          expect(firstId).to.be.a('string');

          console.log('first patient name', name);
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
          const { name, patientId: secondId } = body;

          expect(status).to.equal(201);
          expect(body).to.be.an('object');
          expect(body).to.have.all.keys(patientObjectKeys);
          expect(name).to.equal('Barrett Hilpert');
          expect(secondId).to.be.a('string');

          console.log('second patient name', name);
          patientTwoId = secondId;

          done();
        })
        .catch(error => {
          const { message } = error;

          done(new Error(message));
        });
    });

    it('should make sure that both patient IDs are different', done => {
      // This test is temporary -- using it to debug why two other tests are failing.
      try {
        expect(patientOneId).to.not.equal(patientTwoId);

        done();
      } catch (error) {
        const { message } = error;

        done(message);
      }
    });

    it('should show an error message if one or more required fields are missing', done => {
      firstValidAuthTokenUser
        .post('/api/patients')
        .set('authentication', firstAuthToken)
        .send(incompletePatientInformation)
        .then(res => {
          const { status, body } = res;
          const { message } = body;

          expect(status).to.equal(400);
          expect(message).to.equal('Missing required field(s).');

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

          expect(status).to.equal(500);
          expect(auth).to.be.false;
          expect(message).to.equal('Failed to authenticate the provided token.');

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

          expect(status).to.equal(403);
          expect(auth).to.be.false;
          expect(message).to.equal('No authentication token was provided.');

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

          expect(status).to.equal(200);
          expect(body)
            .to.be.an('array')
            .and.have.length(1);

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

          expect(status).to.equal(200);
          expect(body).to.be.an('object');
          expect(patientId).to.equal(patientOneId);

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

          expect(status).to.equal(200);
          expect(body).to.be.an('object');
          expect(patientId).to.equal(patientTwoId);

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

          expect(status).to.equal(404);
          expect(message).to.equal(`Could not find/ no patient with ID ${invalidPatientId}`);

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
          expect(status).to.equal(404);
          expect(message).to.equal(`Could not find/ no patient with ID ${patientTwoId}`);

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

          expect(status).to.equal(204);

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

          expect(status).to.equal(404);
          expect(message).to.equal(`Could not find/ no patient with ID ${patientTwoId}`);

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

          expect(status).to.equal(204);

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

          expect(status).to.equal(404);
          expect(message).to.equal(`Could not find/ no patient with ID ${patientTwoId}`);

          done();
        })
        .catch(error => {
          const { message } = error;

          done(new Error(message));
        });
    });
  });
});
