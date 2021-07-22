const chai = require('chai');

const { expect } = chai;
const sinon = require('sinon');
const request = require('supertest');

const app = require('../../../app');
const dbCommandsAdmin = require('../../../model/dbCommandsAdmin');

const DatabaseError = require('../../../errors/DatabaseError');

describe('Login', () => {
  describe('checkIfUserExists', () => {
    it('Should return 200 and true if user exists', async () => {
      const returnedResults = [{ name: 'fakeJobName' }];
      const checkIfUserExistsStub = sinon.stub(dbCommandsAdmin, 'checkIfUserExists');
      checkIfUserExistsStub.returns(returnedResults);
      await request(app)
        .get('/login/checkIfUserExists/fakeJobName')
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          expect(response.text).equal('true');
        });
      checkIfUserExistsStub.restore();
    });
    it('Should return 200 and false if user does not exists', async () => {
      const returnedResults = [];
      const checkIfUserExistsStub = sinon.stub(dbCommandsAdmin, 'checkIfUserExists');
      checkIfUserExistsStub.returns(returnedResults);
      await request(app)
        .get('/login/checkIfUserExists/fakeJobName')
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          expect(response.text).equal('false');
        });
      checkIfUserExistsStub.restore();
    });
    it('Should return 500 if there is a database error', async () => {
      const checkIfUserExistsStub = sinon.stub(dbCommandsAdmin, 'checkIfUserExists');
      checkIfUserExistsStub.throws(new DatabaseError());
      await request(app)
        .get('/login/checkIfUserExists/fakeJobName')
        .set('Accept', 'application/json')
        .expect(500)
        .then((response) => {
          expect(response.text).equal('Database Error');
        });
      checkIfUserExistsStub.restore();
    });
  });
  describe('getPassword', () => {
    it('Should return 200 and password', async () => {
      const returnedResults = [{ Password: 'Apples' }];
      const getUsersPasswordStub = sinon.stub(dbCommandsAdmin, 'getUsersPassword');
      getUsersPasswordStub.returns(returnedResults);
      await request(app)
        .post('/login/getPassword')
        .send({ username: 'fakeJobName' })
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          expect(response.text).equal(returnedResults[0].Password);
        });
      getUsersPasswordStub.restore();
    });
    it('Should return 500 if there is a database error', async () => {
      const getUsersPasswordStub = sinon.stub(dbCommandsAdmin, 'getUsersPassword');
      getUsersPasswordStub.throws(new DatabaseError());
      await request(app)
        .post('/login/getPassword')
        .send({ username: 'fakeJobName' })
        .expect(500)
        .then((response) => {
          expect(response.text).equal('Database Error');
        });
      getUsersPasswordStub.restore();
    });
  });
  describe('checkIfAdmin', () => {
    it('Should return 200 and true if User is an admin', async () => {
      const returnedResults = [{ username: 'fakeJobName', isAdmin: 1 }];
      const checkIfAdminStub = sinon.stub(dbCommandsAdmin, 'checkIfAdmin');
      checkIfAdminStub.returns(returnedResults);
      await request(app)
        .get('/login/checkIfAdmin/fakeJobName')
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          expect(response.text).equal('true');
        });
      checkIfAdminStub.restore();
    });
    it('Should return 200 and false if User is not an admin', async () => {
      const returnedResults = [];
      const checkIfAdminStub = sinon.stub(dbCommandsAdmin, 'checkIfAdmin');
      checkIfAdminStub.returns(returnedResults);
      await request(app)
        .get('/login/checkIfAdmin/fakeName')
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.text).equal('false');
        });
      checkIfAdminStub.restore();
    });
    it('Should return 500 if there is a database error', async () => {
      const checkIfAdminStub = sinon.stub(dbCommandsAdmin, 'checkIfAdmin');
      checkIfAdminStub.throws(new DatabaseError());
      await request(app)
        .get('/login/checkIfAdmin/fakeJobName')
        .set('Accept', 'application/json')
        .expect(500)
        .then((response) => {
          expect(response.text).equal('Database Error');
        });
      checkIfAdminStub.restore();
    });
  });
});
