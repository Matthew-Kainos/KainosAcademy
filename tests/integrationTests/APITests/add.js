const chai = require('chai');

const { expect } = chai;
const sinon = require('sinon');
const request = require('supertest');

const app = require('../../../app');
const dbCommands = require('../../../model/dbCommands');
const dbCommandsAdmin = require('../../../model/dbCommandsAdmin');

const DatabaseError = require('../../../errors/DatabaseError');

const newRoleDetails = {
  RoleName: 'FakeFamily',
  SpecSum: 'FakeSummary',
  SpecLink: 'FakeLink',
  Capability: 'Fake Capability',
  Band: 'FakeBand',
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
});

const newFamilyDetails = {
  FamilyName: 'FakeFamileName',
  LeadName: 'FakeLeadName',
  LeadMessage: 'FakeMessage',
  LeadImage: 'FakeImageURL',
  Capability: 'Fake Capability',
};

describe('Add', () => {
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
