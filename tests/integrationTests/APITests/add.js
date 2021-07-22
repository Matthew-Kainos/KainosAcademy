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
  RoleName: 'FakeFamily',
  SpecSum: 'FakeSummary',
  SpecLink: 'FakeLink',
  Capability: 'Fake Capability',
  Band: 'FakeBand',
};

const newBandDetails = {
  bandName: 'FakeName',
  bandPlace: 'bandAbove',
  bands: 'FakeRefBand',
  training: 'FakeTraining',
  competency: 'FakeCompetencyLevel',
  responsiblities: 'FakeResponsibilities',
};

const newFamilyDetails = {
  FamilyName: 'FakeFamileName',
  LeadName: 'FakeLeadName',
  LeadMessage: 'FakeMessage',
  LeadImage: 'FakeImageURL',
  Capability: 'Fake Capability',
};

const newCapabilityDetails = {
  Name: 'FakeCapability',
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

  describe('Band', () => {
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
          expect(response.body.message).to.equal(`New Band ${newBandDetails.bandName} Added`);
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

  describe('capability', () => {
    it('Should return 200 with success message if new capability added to database', async () => {
      const checkIfCapabilityExistsStub = sinon.stub(dbCommands, 'checkIfCapabilityExists');
      const addNewCapabilityStub = sinon.stub(dbCommandsAdmin, 'addNewCapability');

      checkIfCapabilityExistsStub.returns([]);
      addNewCapabilityStub.returns({ success: true, message: `New Capability ${newCapabilityDetails.Name} Added` });

      await request(app)
        .post('/add/capability')
        .set('Accept', 'application/json')
        .expect(200)
        .send({ newCapabilityDetails })
        .then((response) => {
          expect(response.body.success).to.equal(true);
          expect(response.body.message).to.equal(`New Capability ${newCapabilityDetails.Name} Added`);
        });

      checkIfCapabilityExistsStub.restore();
      addNewCapabilityStub.restore();
    });
    it('Should return 400 with failure message if new role name a duplicate', async () => {
      const checkIfCapabilityExistsStub = sinon.stub(dbCommands, 'checkIfCapabilityExists');
      checkIfCapabilityExistsStub.returns([{ data: 'abc' }]);
      await request(app)
        .post('/add/capability')
        .set('Accept', 'application/json')
        .expect(200)
        .send({ newCapabilityDetails })
        .then((response) => {
          expect(response.body.success).to.equal(false);
          expect(response.body.message).to.equal('Unable to add Capability due to Duplicate Capability Name');
        });
      checkIfCapabilityExistsStub.restore();
    });
    it('Should return 500 if there is a database error', () => {
      const checkIfCapabilityExistsStub = sinon.stub(dbCommands, 'checkIfCapabilityExists');
      checkIfCapabilityExistsStub.throws(new DatabaseError());
      request(app)
        .post('/add/capability')
        .set('Accept', 'application/json')
        .send({ newCapabilityDetails })
        .expect(500)
        .then((response) => {
          expect(response.text).equal('Database Error');
        });
      checkIfCapabilityExistsStub.restore();
    });
  });

  describe('family', () => {
    it('Should return 200 with success message if new family added to database', async () => {
      const checkIfFamilyExistsStub = sinon.stub(dbCommands, 'checkIfFamilyExists');
      const getCapabilityIdFromNameStub = sinon.stub(dbCommandsAdmin, 'getCapabilityIdFromName');
      const addNewFamilyStub = sinon.stub(dbCommandsAdmin, 'addNewFamily');

      checkIfFamilyExistsStub.returns([]);
      getCapabilityIdFromNameStub.returns([{ data: 'CapId' }]);
      addNewFamilyStub.returns({ success: true, message: `New Family ${newFamilyDetails.FamilyName} Added` });

      await request(app)
        .post('/add/family')
        .set('Accept', 'application/json')
        .expect(200)
        .send({ newFamilyDetails })
        .then((response) => {
          expect(response.body.success).to.equal(true);
          expect(response.body.message).to.equal(`New Family ${newFamilyDetails.FamilyName} Added`);
        });

      checkIfFamilyExistsStub.restore();
      getCapabilityIdFromNameStub.restore();
      addNewFamilyStub.restore();
    });
    it('Should return 400 with failure message if new role name a duplicate', async () => {
      const checkIfFamilyExistsStub = sinon.stub(dbCommands, 'checkIfFamilyExists');
      checkIfFamilyExistsStub.returns([{ data: 'abc' }]);
      await request(app)
        .post('/add/family')
        .set('Accept', 'application/json')
        .expect(200)
        .send({ newFamilyDetails })
        .then((response) => {
          expect(response.body.success).to.equal(false);
          expect(response.body.message).to.equal('Unable to add Family due to Duplicate Family Name');
        });
      checkIfFamilyExistsStub.restore();
    });
    it('Should return 500 if there is a database error', () => {
      const checkIfFamilyExistsStub = sinon.stub(dbCommands, 'checkIfFamilyExists');
      checkIfFamilyExistsStub.throws(new DatabaseError());
      request(app)
        .post('/add/family')
        .set('Accept', 'application/json')
        .send({ newFamilyDetails })
        .expect(500)
        .then((response) => {
          expect(response.text).equal('Database Error');
        });
      checkIfFamilyExistsStub.restore();
    });
  });
});
