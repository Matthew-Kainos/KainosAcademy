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

describe('Capabilities', () => {
  describe('checkIfCapabilityExists', () => {
    it('Should return 200 and correct results if called', () => {
      const returnedResults = { CapabilityName: 'fakeCapName', FamilyName: 'FakeFamilyName' };
      const checkIfCapabilityExistsStub = sinon.stub(dbCommands, 'checkIfCapabilityExists');
      checkIfCapabilityExistsStub.returns(returnedResults);
      request(app)
        .get('/checkIfCapabilityExists/fakeCapName')
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          expect(response.text).equal(JSON.stringify(returnedResults));
        });
      checkIfCapabilityExistsStub.restore();
    });
    it('Should return 500 if there is a database error', () => {
      const checkIfCapabilityExistsStub = sinon.stub(dbCommands, 'checkIfCapabilityExists');
      checkIfCapabilityExistsStub.throws(new DatabaseError());
      request(app)
        .get('/capabilities/getAllFamiliesWithCapability')
        .set('Accept', 'application/json')
        .expect(500)
        .then((response) => {
          expect(response.text).equal('Database Error');
        });
      checkIfCapabilityExistsStub.restore();
    });
  });
  describe('getAllFamiliesWithCapability', () => {
    it('Should return 200 and correct results if called', () => {
      const returnedResults = { CapabilityName: 'fakeCapName', FamilyName: 'FakeFamilyName' };
      const getAllFamiliesWithCapabilityStub = sinon.stub(dbCommands, 'getAllFamiliesWithCapability');
      getAllFamiliesWithCapabilityStub.returns(returnedResults);
      request(app)
        .get('/capabilities/getAllFamiliesWithCapability')
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          expect(response.text).equal(JSON.stringify(returnedResults));
        });
      getAllFamiliesWithCapabilityStub.restore();
    });
    it('Should return 500 if there is a database error', () => {
      const getAllFamiliesWithCapabilityStub = sinon.stub(dbCommands, 'getAllFamiliesWithCapability');
      getAllFamiliesWithCapabilityStub.throws(new DatabaseError());
      request(app)
        .get('/capabilities/getAllFamiliesWithCapability')
        .set('Accept', 'application/json')
        .expect(500)
        .then((response) => {
          expect(response.text).equal('Database Error');
        });
      getAllFamiliesWithCapabilityStub.restore();
    });
  });

  describe('viewCapabilityLead', () => {
    it('Should return 200 and correct results if called', () => {
      const returnedResults = { capID: '1' };
      const getCapabilityLeadStub = sinon.stub(dbCommands, 'getCapabilityLead');
      getCapabilityLeadStub.returns(returnedResults);
      request(app)
        .get('capabilites/viewCapabilityLead/1')
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          expect(response.text).equal(JSON.stringify(returnedResults));
        });
      getCapabilityLeadStub.restore();
    });
    it('Should return 500 if there is a database error', () => {
      const getCapabilityLeadStub = sinon.stub(dbCommands, 'getCapabilityLead');
      getCapabilityLeadStub.throws(new DatabaseError());
      request(app)
        .get('/capabilities/viewCapabilityLead/1')
        .set('Accept', 'application/json')
        .expect(500)
        .then((response) => {
          expect(response.text).equal('Database Error');
        });
      getCapabilityLeadStub.restore();
    });
  });
});
