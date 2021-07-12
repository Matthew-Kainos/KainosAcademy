const chai = require('chai');  
const expect = chai.expect;
const sinon = require('sinon');
const request = require('supertest');

const app = require('../../../app');
const dbCommands = require('../../../model/dbCommands');

const DatabaseError = require('../../../errors/DatabaseError'); 

describe('Capabilities', function() {
  describe('findByJobName', function() {
    it('Should return 200 and correct results if called', function() {
      const returnedResults = { name: 'fakeJobName'};
      const getCapabilitiesBasedOnJobNameStub = sinon.stub(dbCommands, "getCapabilitiesBasedOnJobName");
      getCapabilitiesBasedOnJobNameStub.returns(returnedResults);
      request(app)
        .get('/capabilities/findByJobName/fakeJobName')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
            expect(response.text).equal(JSON.stringify(returnedResults));
        });
        getCapabilitiesBasedOnJobNameStub.restore();
    });
    it('Should return 500 if there is a database error', function() {
      const getCapabilitiesBasedOnJobNameStub = sinon.stub(dbCommands, "getCapabilitiesBasedOnJobName");
      getCapabilitiesBasedOnJobNameStub.throws(new DatabaseError);
      request(app)
        .get('/capabilities/findByJobName/fakeJob')
        .set('Accept', 'application/json')
        .expect(500)
        .then(response => {
            expect(response.text).equal('Database Error');
        });
        getCapabilitiesBasedOnJobNameStub.restore();
    });
  });
})