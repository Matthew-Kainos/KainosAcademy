const chai = require('chai');

const { expect } = chai;
const sinon = require('sinon');
const request = require('supertest');

const app = require('../../../app');
const dbCommands = require('../../../model/dbCommands');
const dbCommandsAdmin = require('../../../model/dbCommandsAdmin');

const addBandController = require('../../../controller/addBandController');

const DatabaseError = require('../../../errors/DatabaseError');

const newRoleDetails = {
  RoleName: 'FakeJob',
  SpecSum: 'FakeSummary',
  SpecLink: 'FakeLink',
  Capability: 'Fake Capability',
  Band: 'FakeBand',
};

const newBandDetails = {
  name: 'FakeName',
  aboveOrBelow: 'bandAbove',
  refBand: 'FakeRefBand',
  training: 'FakeTraining',
  competencies: 'FakeCompetencyLevel',
  responsiblities: 'FakeResponsibilities',
};

describe('Add', () => {
  describe('role', () => {
    it('Should return 200 with success message if new role added to database', async () => {
      const checkIfJobExistsStub = sinon.stub(dbCommands, 'checkIfJobExists');
      const getCapabilityIdFromNameStub = sinon.stub(dbCommandsAdmin, 'getCapabilityIdFromName');
      const getBandIdFromNameStub = sinon.stub(dbCommandsAdmin, 'getBandIdFromName');
      const addNewRoleStub = sinon.stub(dbCommandsAdmin, 'addNewRole');

      checkIfJobExistsStub.returns([]);
      getCapabilityIdFromNameStub.returns([{ data: 'CapId' }]);
      getBandIdFromNameStub.returns([{ data: 'BandId' }]);
      addNewRoleStub.returns({ success: true, message: `New Role ${newRoleDetails.RoleName} Added` });

      await request(app)
        .post('/add/role')
        .set('Accept', 'application/json')
        .expect(200)
        .send({ newRoleDetails })
        .then((response) => {
          expect(response.body.success).to.equal(true);
          expect(response.body.message).to.equal(`New Role ${newRoleDetails.RoleName} Added`);
        });

      checkIfJobExistsStub.restore();
      getCapabilityIdFromNameStub.restore();
      getBandIdFromNameStub.restore();
      addNewRoleStub.restore();
    });
    it('Should return 400 with failure message if new role name a duplicate', async () => {
      const checkIfJobExistsStub = sinon.stub(dbCommands, 'checkIfJobExists');
      checkIfJobExistsStub.returns([{ data: 'abc' }]);
      await request(app)
        .post('/add/role')
        .set('Accept', 'application/json')
        .expect(200)
        .send({ newRoleDetails })
        .then((response) => {
          expect(response.body.success).to.equal(false);
          expect(response.body.message).to.equal('Unable to add Role due to Duplicate Role Name');
        });
      checkIfJobExistsStub.restore();
    });
    it('Should return 500 if there is a database error', () => {
      const checkIfJobExistsStub = sinon.stub(dbCommands, 'checkIfJobExists');
      checkIfJobExistsStub.throws(new DatabaseError());
      request(app)
        .post('/add/role')
        .set('Accept', 'application/json')
        .send({ newRoleDetails })
        .expect(500)
        .then((response) => {
          expect(response.text).equal('Database Error');
        });
      checkIfJobExistsStub.restore();
    });
  });

  describe('band', () => {
    it('Should return 200 with success message if new band added to database', async () => {
      const checkIfBandExistsStub = sinon.stub(dbCommands, 'checkIfBandExists');
      const getBandLevelStub = sinon.stub(dbCommandsAdmin, 'getBandLevel');
      const updateBandLevelsStub = sinon.stub(dbCommandsAdmin, 'updateBandLevels');
      const addBandStub = sinon.stub(dbCommandsAdmin, 'addBand');
      const setAddBandQueryDataStub = sinon.stub(addBandController, 'setAddBandQueryData');
      const setTrainingforBandStub = sinon.stub(addBandController, 'setTrainingforBand');

      checkIfBandExistsStub.returns([]);
      getBandLevelStub.returns([{ Level: 1 }]);
      updateBandLevelsStub.returns({ success: true, message: 'Updated Band Levels' });
      addBandStub.returns({ success: true, message: 'New Band Added' });
      setTrainingforBandStub.returns({ success: true, message: 'New Band Added' });
      setAddBandQueryDataStub.returns({
        Name: 'FakeName', Level: 1, Training: 'FakeTraining', Competencies: 'FakeCompetencyLevel', Responsibilities: 'FakeResponsibilities',
      });

      await request(app)
        .post('/add/band')
        .set('Accept', 'application/json')
        .expect(200)
        .send({ newBandDetails })
        .then((response) => {
          expect(response.body.success).to.equal(true);
          expect(response.body.message).to.equal(`New Band ${newBandDetails.name} Added`);
        });

      checkIfBandExistsStub.restore();
      getBandLevelStub.restore();
      updateBandLevelsStub.restore();
      setTrainingforBandStub.restore();
      setAddBandQueryDataStub.restore();
      addBandStub.restore();
    });
    it('Should return 400 with failure message if new role name a duplicate', async () => {
      const checkIfBandExistsStub = sinon.stub(dbCommands, 'checkIfBandExists');
      checkIfBandExistsStub.returns([{ data: 'abc' }]);
      await request(app)
        .post('/add/band')
        .set('Accept', 'application/json')
        .expect(200)
        .send({ newBandDetails })
        .then((response) => {
          expect(response.body.success).to.equal(false);
          expect(response.body.message).to.equal('Unable to add Band due to Duplicate Band Name');
        });
      checkIfBandExistsStub.restore();
    });
    it('Should return 500 if there is a database error', () => {
      const checkIfBandExistsStub = sinon.stub(dbCommands, 'checkIfBandExists');
      checkIfBandExistsStub.throws(new DatabaseError());
      request(app)
        .post('/add/role')
        .set('Accept', 'application/json')
        .send({ newRoleDetails })
        .expect(500)
        .then((response) => {
          expect(response.text).equal('Database Error');
        });
      checkIfBandExistsStub.restore();
    });
  });
});
