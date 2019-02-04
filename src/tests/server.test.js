import request from 'supertest';
import { expect } from 'chai';
import app from '../server';

describe('GET /', () => {
  it('should return a 200 status code', done => {
    request(app)
      .get('/')
      .then(res => {
        expect(res.status).to.equal(200);

        done();
      });
  });

  it('should send the correct message to check the documentation', done => {
    request(app)
      .get('/')
      .then(res => {
        expect(res.text).to.equal(
          'Please go to https://github.com/vzhny/pacientech-api for API usage information.'
        );

        done();
      });
  });
});
