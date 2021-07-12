const chai = require('chai');  
const expect = chai.expect;
const sinon = require('sinon');
const request = require('supertest');

const app = require('../../../app');
const dbCommands = require('../../../model/dbCommands');

const DatabaseError = require('../../../errors/DatabaseError'); 

describe('JobsByBand', function() {
  describe('getRoleAndBandDB', function() {
    it('Should return 200 and correct results if called', function() {
      const returnedResults = {"Role":"Chief Technical Officer","RoleBand":"Leadership Community"};
      const getRoleAndBandDBStub = sinon.stub(dbCommands, "getRoleAndBandDB");
      getRoleAndBandDBStub.returns(returnedResults);
      request(app)
        .get('/jobs/band/Chief Technical Officer')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
            expect(response.text).equal(JSON.stringify(returnedResults));
        });
        getRoleAndBandDBStub.restore();
    });

    it('Should return 500 if there is a database error', function() {
      const getRoleAndBandDBStub = sinon.stub(dbCommands, "getRoleAndBandDB");
      getRoleAndBandDBStub.throws(new DatabaseError);
      request(app)
        .get('/jobs/band/Chief Technical Officer')
        .set('Accept', 'application/json')
        .expect(500)
        .then(response => {
            expect(response.text).equal('Error');
        });
        getRoleAndBandDBStub.restore();
    });
  });
})

