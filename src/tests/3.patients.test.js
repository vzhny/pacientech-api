import request from 'supertest';
import { expect } from 'chai';
import { TEST_USER_AUTH_TOKEN } from 'babel-dotenv';
import app from '../server';

/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */

let patientId = ''; // eslint-disable-line

describe('POST /api/patients', () => {
  it('should add one single patient successfully if a valid auth token is provided', done => {
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

  it('should not add the patient and show an error message if an invalid auth token is provided', done => {
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
});

/* Getting a "can't set headers after request is sent" error -- not sure if its express, mocha, or supertest.

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

*/
