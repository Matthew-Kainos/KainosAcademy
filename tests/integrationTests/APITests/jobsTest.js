const chai = require('chai');  
const expect = chai.expect;
const sinon = require('sinon');
const request = require('supertest');

const app = require('../../../app');
const dbCommands = require('../../../model/dbCommands');

const DatabaseError = require('../../../errors/DatabaseError'); 

describe('JobRoles', function() {
    it('Should return 200 and correct results if called', function() {
      const returnedResults = { Role_id: 'fakeId'};
      const getJobRolesStub = sinon.stub(dbCommands, "getJobRoles");
      getJobRolesStub.returns(returnedResults);
      request(app)
        .get('job-roles')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
            expect(response.text).equal(JSON.stringify(returnedResults));
        });
        getJobRolesStub.restore();
    });
    it('Should return 500 if there is a database error', function() {
      const getJobRolesStub = sinon.stub(dbCommands, "getJobRoles");
      getJobRolesStub.throws(new DatabaseError);
      request(app)
        .get('/job-role')
        .set('Accept', 'application/json')
        .expect(500)
        .then(response => {
            expect(response.text).equal('Database Error');
        });
        getJobRolesStub.restore();
    });
})