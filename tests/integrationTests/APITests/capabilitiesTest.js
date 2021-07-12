const chai = require('chai');  
const expect = chai.expect;
const sinon = require('sinon');
const request = require('supertest');

const app = require('../../../app');
const dbCommands = require('../../../model/dbCommands');

const DatabaseError = require('../../../errors/DatabaseError'); 

describe('Capabilities', function() {
  describe('family', function() {
    it('Should return 200 and correct results if called', function() {
      const returnedResults = { capName: 'fakeCapName'};
      const getFamilyBasedOnCapabilityStub = sinon.stub(dbCommands, "getFamilyBasedOnCapability");
      getFamilyBasedOnCapabilityStub.returns(returnedResults);
      request(app)
        .get('/capabilities/family/1')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
            expect(response.text).equal(JSON.stringify(returnedResults));
        });
        getFamilyBasedOnCapabilityStub.restore();
    });
    it('Should return 500 if there is a database error', function() {
      const getFamilyBasedOnCapabilityStub = sinon.stub(dbCommands, "getFamilyBasedOnCapability");
      getFamilyBasedOnCapabilityStub.throws(new DatabaseError);
      return request(app)
        .get('/capabilities/family/1')
        .set('Accept', 'application/json')
        .expect(500)
        .then(response => {
            expect(response.text).equal('Database Error');
        });
    });
  });
})