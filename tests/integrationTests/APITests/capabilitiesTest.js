const chai = require('chai');

const { expect } = chai;
const sinon = require('sinon');
const request = require('supertest');

const app = require('../../../app');
const dbCommands = require('../../../model/dbCommands');

const DatabaseError = require('../../../errors/DatabaseError');

describe('Capabilities', () => {
  describe('family', () => {
    it('Should return 200 and correct results if called', () => {
      const returnedResults = { capName: 'fakeCapName' };
      const getFamilyBasedOnCapabilityStub = sinon.stub(dbCommands, 'getFamilyBasedOnCapability');
      getFamilyBasedOnCapabilityStub.returns(returnedResults);
      request(app)
        .get('/capabilities/family/fakeCapName')
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          expect(response.text).equal(JSON.stringify(returnedResults));
        });
      getFamilyBasedOnCapabilityStub.restore();
    });
    it('Should return 500 if there is a database error', () => {
      const getFamilyBasedOnCapabilityStub = sinon.stub(dbCommands, 'getFamilyBasedOnCapability');
      getFamilyBasedOnCapabilityStub.throws(new DatabaseError());
      request(app)
        .get('/capabilities/family/fakeCapName')
        .set('Accept', 'application/json')
        .expect(500)
        .then((response) => {
          expect(response.text).equal('Database Error');
        });
      getFamilyBasedOnCapabilityStub.restore();
    });
  });

  describe('Capabilities', () => {
    describe('findByJobName', () => {
      it('Should return 200 and correct results if called', () => {
        const returnedResults = { name: 'fakeJobName' };
        const getCapabilitiesBasedOnJobNameStub = sinon.stub(dbCommands, 'getCapabilitiesBasedOnJobName');
        getCapabilitiesBasedOnJobNameStub.returns(returnedResults);
        request(app)
          .get('/capabilities/findByJobName/fakeJobName')
          .set('Accept', 'application/json')
          .expect(200)
          .then((response) => {
            expect(response.text).equal(JSON.stringify(returnedResults));
          });
        getCapabilitiesBasedOnJobNameStub.restore();
      });
      it('Should return 500 if there is a database error', () => {
        const getCapabilitiesBasedOnJobNameStub = sinon.stub(dbCommands, 'getCapabilitiesBasedOnJobName');
        getCapabilitiesBasedOnJobNameStub.throws(new DatabaseError());
        request(app)
          .get('/capabilities/findByJobName/fakeJob')
          .set('Accept', 'application/json')
          .expect(500)
          .then((response) => {
            expect(response.text).equal('Database Error');
          });
        getCapabilitiesBasedOnJobNameStub.restore();
      });
    });
  });
});
