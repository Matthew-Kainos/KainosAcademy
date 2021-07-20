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
  describe('getAllBandsAndCompetencies', () => {
    it('Should return 200 and correct results if called', () => {
      const returnedResults = { BandName: 'fakeBandName', CompetencyName: 'fakeCompName' };
      const getAllBandsAndCompetenciesStub = sinon.stub(dbCommands, 'getAllBandsAndCompetencies');
      getAllBandsAndCompetenciesStub.returns(returnedResults);
      request(app)
        .get('/bands/getAllBandsAndCompetencies')
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          expect(response.text).equal(JSON.stringify(returnedResults));
        });
      getAllBandsAndCompetenciesStub.restore();
    });
    it('Should return 500 if there is a database error', () => {
      const getAllBandsAndCompetenciesStub = sinon.stub(dbCommands, 'getAllBandsAndCompetencies');
      getAllBandsAndCompetenciesStub.throws(new DatabaseError());
      request(app)
        .get('/bands/getAllBandsAndCompetencies')
        .set('Accept', 'application/json')
        .expect(500)
        .then((response) => {
          expect(response.text).equal('Database Error');
        });
      getAllBandsAndCompetenciesStub.restore();
    });
  });
});
