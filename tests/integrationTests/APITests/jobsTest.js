const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const request = require('supertest');

const app = require('../../../app');
const dbCommands = require('../../../model/dbCommands');

const DatabaseError = require('../../../errors/DatabaseError');

describe('Jobs', function () {
  describe('checkIfJobExists', function () {
    it('Should return 200 and correct results if called', function () {
      const returnedResults = { CapabilityName: 'fakeJobName', JobRoleName: 'FakeJob' };
      const checkIfJobExistsStub = sinon.stub(dbCommands, "checkIfJobExists");
      checkIfJobExistsStub.returns(returnedResults);
      request(app)
        .get('/checkIfJobExists/fakeName')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.text).equal(JSON.stringify(returnedResults));
        });
        checkIfJobExistsStub.restore();
    });
    it('Should return 500 if there is a database error', function () {
      const checkIfJobExistsStub = sinon.stub(dbCommands, "checkIfJobExists");
      checkIfJobExistsStub.throws(new DatabaseError);
      request(app)
        .get('/jobs/getAllJobsWithCapability')
        .set('Accept', 'application/json')
        .expect(500)
        .then(response => {
          expect(response.text).equal('Database Error');
        });
        checkIfJobExistsStub.restore();
    });
  });
  describe('getAllJobsWithCapability', function () {
    it('Should return 200 and correct results if called', function () {
      const returnedResults = { CapabilityName: 'fakeJobName', JobRoleName: 'FakeJob' };
      const getAllJobsWithCapabilityStub = sinon.stub(dbCommands, "getAllJobsWithCapability");
      getAllJobsWithCapabilityStub.returns(returnedResults);
      request(app)
        .get('/jobs/getAllJobsWithCapability')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          expect(response.text).equal(JSON.stringify(returnedResults));
        });
      getAllJobsWithCapabilityStub.restore();
    });
    it('Should return 500 if there is a database error', function () {
      const getAllJobsWithCapabilityStub = sinon.stub(dbCommands, "getAllJobsWithCapability");
      getAllJobsWithCapabilityStub.throws(new DatabaseError);
      request(app)
        .get('/jobs/getAllJobsWithCapability')
        .set('Accept', 'application/json')
        .expect(500)
        .then(response => {
          expect(response.text).equal('Database Error');
        });
      getAllJobsWithCapabilityStub.restore();
    });
  });
})

describe('Jobs', function() {
  describe('getJobSpec', function() {
    it('Should return 200 and correct results if called', function() {
      const returnedResults = { role_id: 'fakeId'};
      const getJobSpec = sinon.stub(dbCommands, "getJobSpec");
      getJobSpec.returns(returnedResults);
      request(app)
        .get('/jobs/job-spec-roles/1')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
            expect(response.text).equal(JSON.stringify(returnedResults));
        });
        getJobSpec.restore();
    });
    it('Should return 500 if there is a database error', function() {
      const getJobSpec = sinon.stub(dbCommands, "getJobSpec");
      getJobSpec.throws(new DatabaseError);
      request(app)
        .get('/jobs/job-roles-spec/1')
        .set('Accept', 'application/json')
        .expect(500)
        .then(response => {
            expect(response.text).equal('Database Error');
        });
        getJobSpec.restore();
    });
  });
}) 
