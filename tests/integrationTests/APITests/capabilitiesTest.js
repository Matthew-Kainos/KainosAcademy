const chai = require('chai');

const { expect } = chai;
const sinon = require('sinon');
const request = require('supertest');

const app = require('../../../app');
const dbCommands = require('../../../model/dbCommands');

const DatabaseError = require('../../../errors/DatabaseError');

describe('Capabilities', () => {
  describe('findByJobId', () => {
    it('Should return 200 and correct results if called', () => {
      const returnedResults = { role_id: 'fakeId' };
      const getCapabilitiesBasedOnJobIdStub = sinon.stub(dbCommands, 'getCapabilitiesBasedOnJobId');
      getCapabilitiesBasedOnJobIdStub.returns(returnedResults);
      request(app)
        .get('/capabilities/findByJobId/1')
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          expect(response.text).equal(JSON.stringify(returnedResults));
        });
      getCapabilitiesBasedOnJobIdStub.restore();
    });
    it('Should return 500 if there is a database error', () => {
      const getCapabilitiesBasedOnJobIdStub = sinon.stub(dbCommands, 'getCapabilitiesBasedOnJobId');
      getCapabilitiesBasedOnJobIdStub.throws(new DatabaseError());
      request(app)
        .get('/capabilities/findByJobId/1')
        .set('Accept', 'application/json')
        .expect(500)
        .then((response) => {
          expect(response.text).equal('Database Error');
        });
      getCapabilitiesBasedOnJobIdStub.restore();
    });
  });
});
