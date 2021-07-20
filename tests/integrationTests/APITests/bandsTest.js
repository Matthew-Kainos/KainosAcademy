const chai = require('chai');

const { expect } = chai;
const sinon = require('sinon');
const request = require('supertest');

const app = require('../../../app');
const dbCommands = require('../../../model/dbCommands');

const DatabaseError = require('../../../errors/DatabaseError');
// MY CODE ADDED PAGE
describe('Bands', () => {
  describe('competencies', () => {
    it('Should return 200 and correct results if called', () => {
      const returnedResults = { bandName: 'fakeBandName' };
      const getCompetenciesBasedOnBandStub = sinon.stub(dbCommands, 'getCompetenciesBasedOnBand');
      getCompetenciesBasedOnBandStub.returns(returnedResults);
      request(app)
        .get('/band/competencies/fakeBandName')
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          expect(response.text).equal(JSON.stringify(returnedResults));
        });
      getCompetenciesBasedOnBandStub.restore();
    });
    it('Should return 500 if there is a database error', () => {
      const getCompetenciesBasedOnBandStub = sinon.stub(dbCommands, 'getCompetenciesBasedOnBand');
      getCompetenciesBasedOnBandStub.throws(new DatabaseError());
      request(app)
        .get('/band/competencies/fakeBandName')
        .set('Accept', 'application/json')
        .expect(500)
        .then((response) => {
          expect(response.text).equal('Database Error');
        });
      getCompetenciesBasedOnBandStub.restore();
    });
  });
  describe('getAllBands', () => {
    it('Should return 200 and correct results if called', () => {
      const returnedResults = { BandName: 'fakeBandName' };
      const getAllBandsStub = sinon.stub(dbCommands, 'getAllBands');
      getAllBandsStub.returns(returnedResults);
      request(app)
        .get('/bands/getAllBands')
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          expect(response.text).equal(JSON.stringify(returnedResults));
        });
      getAllBandsStub.restore();
    });
    it('Should return 500 if there is a database error', () => {
      const getAllBandsStub = sinon.stub(dbCommands, 'getAllBands');
      getAllBandsStub.throws(new DatabaseError());
      request(app)
        .get('/bands/getAllBands')
        .set('Accept', 'application/json')
        .expect(500)
        .then((response) => {
          expect(response.text).equal('Database Error');
        });
      getAllBandsStub.restore();
    });
  });
});
