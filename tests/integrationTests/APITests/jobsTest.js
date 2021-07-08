const expect = chai.expect;
const sinon = require('sinon');
const request = require('supertest');

const app = require('../../../app');
const dbCommands = require('../../../model/dbCommands');

const DatabaseError = require('../../../errors/DatabaseError'); 

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
        getCapabilitiesBasedOnJobIdStub.restore();
    });
    it('Should return 500 if there is a database error', function() {
      const getJobSpec = sinon.stub(dbCommands, "getJobSpec");
      getJobSpec.throws(new DatabaseError);
      return request(app)
        .get('/jobs/job-roles-spec/1')
        .set('Accept', 'application/json')
        .expect(500)
        .then(response => {
            expect(response.text).equal('Database Error');
        });
    });
  });
}) 