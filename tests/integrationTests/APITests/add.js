const chai = require('chai');

const { expect } = chai;
const sinon = require('sinon');
const request = require('supertest');

const app = require('../../../app');
const dbCommands = require('../../../model/dbCommands');
const dbCommandsAdmin = require('../../../model/dbCommandsAdmin');

const DatabaseError = require('../../../errors/DatabaseError');

const newRoleDetails = {
  RoleName: 'FakeJob',
  SpecSum: 'FakeSummary',
  SpecLink: 'FakeLink',
  Capability: 'Fake Capability',
  Band: 'FakeBand',
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
});
