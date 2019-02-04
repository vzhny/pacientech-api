import request from 'supertest';
import { expect } from 'chai';
import { TEST_USER_AUTH_TOKEN } from 'babel-dotenv';
import app from '../server';

/* eslint-disable no-unused-expressions */

const patientInformation = {
  name: 'Gilda Shields',
  address: '9914 Maia Locks',
  phoneNumbers: [{ type: 'cell', number: '111-111-1111' }],
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

let patientId = '';

describe('POST /api/patients', () => {
  it('should add one single patient successfully if a valid auth token is provided', done => {
    request(app)
      .post('/api/patients')
      .set('authentication', TEST_USER_AUTH_TOKEN)
      .send(patientInformation)
      .then(res => {
        const { status, body } = res;
        const { _id: id } = body;

        expect(status).to.equal(201);
        expect(body).to.be.an('object');
        expect(id).to.be.a('string');

        patientId = id;

        done();
      });
  });

  it('should show an error message if one or more required fields are missing', done => {
    request(app)
      .post('/api/patients')
      .set('authentication', TEST_USER_AUTH_TOKEN)
      .send({})
      .then(res => {
        const { status, body } = res;
        const { message } = body;

        expect(status).to.equal(400);
        expect(message).to.equal('Missing the required name field.');

        done();
      });
  });

  /*

  Disabling the below two tests -- need to figure out why
  removing the auth header then re-adding it causes a crash.

  it('should not add the patient and show an error message if an invalid auth token is provided', done => {
    request(app)
      .post('/api/patients')
      .set('authentication', 'invalid_auth_token')
      .send(patientInformation)
      .then(res => {
        const { status, body } = res;
        const { auth, message } = body;

        expect(status).to.equal(500);
        expect(auth).to.be.false;
        expect(message).to.equal('Failed to authenticate the provided token.');

        done();
      });
  });

  it('should not add the patient and show an error message if no auth token is provided', done => {
    request(app)
      .post('/api/patients')
      .send(patientInformation)
      .then(res => {
        const { status, body } = res;
        const { auth, message } = body;

        expect(status).to.equal(403);
        expect(auth).to.be.false;
        expect(message).to.equal('No authentication token was provided.');

        done();
      });
  });

  */
});

describe('GET /api/patients', () => {
  it('should retrieve all patients created by the user if a valid auth token is provided', done => {
    request(app)
      .get('/api/patients')
      .set('authentication', TEST_USER_AUTH_TOKEN)
      .then(res => {
        const { status, body } = res;

        expect(status).to.equal(200);
        expect(body)
          .to.be.an('array')
          .and.have.length(1);

        done();
      });
  });
});

// TODO - Need to add tests that:
// TODO -   * test for the correct response given an incorrect patientId
// TODO -   * test to make sure the user can't modify a patient they didn't create

describe('GET /api/patients/:patientId', () => {
  it('should successfully retrieve the correct patient given their ID and valid auth token', done => {
    request(app)
      .get(`/api/patients/${patientId}`)
      .set('authentication', TEST_USER_AUTH_TOKEN)
      .then(res => {
        const { status, body } = res;
        const { _id: id } = body;

        expect(status).to.equal(200);
        expect(body).to.be.an('object');
        expect(id).to.equal(patientId);

        done();
      })
      .catch(error => console.log(error));
  });
});

describe('PUT /api/patients/:patientId', () => {
  it('should successfully update the correct patient given their ID and valid auth token', done => {
    const updatedPatient = {
      ...patientInformation,
      notes: 'Updated notes!',
    };

    request(app)
      .put(`/api/patients/${patientId}`)
      .set('authentication', TEST_USER_AUTH_TOKEN)
      .send(updatedPatient)
      .then(res => {
        const { status } = res;

        expect(status).to.equal(204);

        done();
      })
      .catch(error => console.log(error));
  });
});

describe('DELETE /api/patients/:patientId', () => {
  it('should successfully delete the correct patient given their ID and valid auth token', done => {
    request(app)
      .delete(`/api/patients/${patientId}`)
      .set('authentication', TEST_USER_AUTH_TOKEN)
      .then(res => {
        const { status } = res;

        expect(status).to.equal(204);

        done();
      })
      .catch(error => console.log(error));
  });
});
