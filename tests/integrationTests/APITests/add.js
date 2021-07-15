const chai = require('chai');

const { expect } = chai;
const sinon = require('sinon');
const request = require('supertest');

const app = require('../../../app');
const dbCommands = require('../../../model/dbCommands');
const dbCommandsAdmin = require('../../../model/dbCommandsAdmin');

const DatabaseError = require('../../../errors/DatabaseError');

describe('Add', () => {
  describe('role', () => {
    it.only('Should return 200 with success message if new role added to datase', async () => {
      const newRoleDetails = {
        RoleName: 'FakeJob',
        SpecSum: 'FakeSummary',
        SpecLink: 'FakeLink',
        Capability: 'Fake Capability',
        Band: 'FakeBand',
      };

      const checkIfJobExistsStub = sinon.stub(dbCommands, 'checkIfJobExists');
      const getCapabilityIdFromNameStub = sinon.stub(dbCommandsAdmin, 'getCapabilityIdFromName');
      const getBandIdFromNameStub = sinon.stub(dbCommandsAdmin, 'getBandIdFromName');

      checkIfJobExistsStub.returns([]);
      getCapabilityIdFromNameStub.returns([{ data: 'CapId' }]);
      getBandIdFromNameStub.returns([{ data: 'BandId' }]);

      await request(app)
        .post('/add/role')
        .set('Accept', 'application/json')
        .expect(200)
        .send(newRoleDetails)
        .then((response) => {
          console.log(response);
          expect(response.text).equal({ success: true, message: 'New Role Added' });
        });

      checkIfJobExistsStub.restore();
      getCapabilityIdFromNameStub.restore();
      getBandIdFromNameStub.restore();
    });
    it('Should return 200 with success message if new role added to datase', async () => {
      const newRoleDetails = {
        RoleName: 'FakeJob',
        SpecSum: 'FakeSummary',
        SpecLink: 'FakeLink',
        Capability: 'Fake Capability',
        Band: 'FakeBand',
      };

      const checkIfJobExistsStub = sinon.stub(dbCommands, 'checkIfJobExists');
      const getCapabilityIdFromNameStub = sinon.stub(dbCommandsAdmin, 'getCapabilityIdFromName');
      const getBandIdFromNameStub = sinon.stub(dbCommandsAdmin, 'getBandIdFromName');

      checkIfJobExistsStub.returns();
      getCapabilityIdFromNameStub.returns([{ data: 'CapId' }]);
      getBandIdFromNameStub.returns([{ data: 'BandId' }]);

      await request(app)
        .get('/capabilities/findByJobName/fakeJobName')
        .set('Accept', 'application/json')
        .expect(200)
        .send(newRoleDetails)
        .then((response) => {
          expect(response.text).equal({ success: true, message: 'New Role Added' });
        });

      checkIfJobExistsStub.restore();
      getCapabilityIdFromNameStub.restore();
      getBandIdFromNameStub.restore();
    });
    it('Should return 500 if there is a database error', () => {
      const getCapabilitiesBasedOnJobNameStub = sinon.stub(dbCommands, 'getCapabilitiesBasedOnJobName');
      getCapabilitiesBasedOnJobNameStub.throws(new DatabaseError());
      request(app)
        .get('/capabilities/findByJobName/fakeJob')
        .set('Accept', 'application/json')
        .expect(500)
        .then((response) => {
          expect(response.text).equal('Database Error');
        });
      getCapabilitiesBasedOnJobNameStub.restore();
    });
  });
});
