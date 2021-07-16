const chai = require('chai');
const DatabaseError = require('../../errors/DatabaseError');

const { expect } = chai;

const dbCommandsAdmin = require('../../model/dbCommandsAdmin');
const testDatabaseCommands = require('../../model/testDatabaseCommands');

const bandTestDetails = {
  bandId: 9000,
  name: 'TestName',
  level: 1,
  training: 'TestTraining',
  compentencies: 'TestCompetencies',
  responsibilities: 'TestResponsibilities',
};

const additionalBandTestDetails = {
  bandId: 9001,
  name: 'TestNameBandTwo',
  level: 2,
  training: 'TestTraining',
  compentencies: 'TestCompetencies',
  responsibilities: 'TestResponsibilities',
};

const familyTestDetails = {
  familyId: 9000,
  name: 'TestName',
};

const capabilityTestDetails = {
  capId: 9000,
  name: 'TestName',
  jobFamily: 'TestJobFamily',
  leadName: 'TestLeadName',
  leadMessage: 'TestLeadMessage',
  familyId: familyTestDetails.familyId,
  leadImage: 'TestImagePath',
};

const jobRoleTestDetails = {
  roleId: 9000,
  name: 'TestName',
  specSum: 'TestSpec_Sum',
  specLink: 'TestSpec_Link',
  capId: capabilityTestDetails.capId,
  bandId: bandTestDetails.bandId,
};

const additionalJobRoleTestDetails = {
  roleId: 9001,
  name: 'TestNameTwo',
  specSum: 'TestSpec_Sum',
  specLink: 'TestSpec_Link',
  capId: capabilityTestDetails.capId,
  bandId: additionalBandTestDetails.bandId,
};

describe('dbCommandsAdmin', async () => {
  beforeEach(async () => {
    await testDatabaseCommands.testInsertFamily(familyTestDetails);
    await testDatabaseCommands.testInsertBand(bandTestDetails);
    await testDatabaseCommands.testInsertBand(additionalBandTestDetails);
    await testDatabaseCommands.testInsertCapability(capabilityTestDetails);
    await testDatabaseCommands.testInsertJobRole(jobRoleTestDetails);
    await testDatabaseCommands.testInsertJobRole(additionalJobRoleTestDetails);
  });

  afterEach(async () => {
    await testDatabaseCommands.testDeleteJobRole(additionalJobRoleTestDetails.name);
    await testDatabaseCommands.testDeleteJobRole(jobRoleTestDetails.name);
    await testDatabaseCommands.testDeleteCapability(capabilityTestDetails.name);
    await testDatabaseCommands.testDeleteFamily(familyTestDetails.name);
    await testDatabaseCommands.testDeleteBand(bandTestDetails.name);
    await testDatabaseCommands.testDeleteBand(additionalBandTestDetails.name);
  });

  describe('getAllBandNames', async () => {
    it('Should successfully return the band names', async () => {
      const result = await dbCommandsAdmin.getAllBandNames();
      expect(result.length).to.greaterThan(0);
      expect(result[0].Name).to.be.an('string');
    });
  });

  describe('getAllCapabilityNames', async () => {
    it('Should successfully return the capability names', async () => {
      const result = await dbCommandsAdmin.getAllCapabilityNames();
      expect(result.length).to.greaterThan(0);
      expect(result[0].Name).to.be.an('string');
    });
  });

  describe('getCapabilityIdFromName', async () => {
    it('Should successfully return the capability id based on capability name', async () => {
      const result = await dbCommandsAdmin.getCapabilityIdFromName(capabilityTestDetails.name);
      expect(result.length).to.greaterThan(0);
      expect(result[0].Cap_ID).to.equal(capabilityTestDetails.capId);
    });
    it('Should successfully throw Database Error is error occurs in database', async () => {
      try {
        await dbCommandsAdmin.getCapabilityIdFromName(null);
      } catch (e) {
        expect(e instanceof DatabaseError).equal(true);
        expect(e.message).to.include('Error calling getCapabilityIdFromName with message');
      }
    });
  });

  describe('getBandIdFromName', async () => {
    it('Should successfully return the band id based on band name', async () => {
      const result = await dbCommandsAdmin.getBandIdFromName(bandTestDetails.name);
      expect(result.length).to.greaterThan(0);
      expect(result[0].BandID).to.equal(bandTestDetails.bandId);
    });
    it('Should successfully throw Database Error is error occurs in database', async () => {
      try {
        await dbCommandsAdmin.getBandIdFromName(null);
      } catch (e) {
        expect(e instanceof DatabaseError).equal(true);
        expect(e.message).to.include('Error calling getBandIdFromName with message');
      }
    });
  });
  describe('addNewRole', async () => {
    it('Should successfully add new role ', async () => {
      const newRoleDetails = {
        roleName: 'TestRole2',
        specSum: 'mySum',
        specLink: 'link',
        capId: capabilityTestDetails.capId,
        bandId: bandTestDetails.bandId,
      };
      await dbCommandsAdmin.addNewRole(newRoleDetails);
      const result = await dbCommandsAdmin.checkInsertRole(newRoleDetails.roleName);
      expect(result[0].Name).to.equal(newRoleDetails.roleName);
      await testDatabaseCommands.testDeleteJobRole(newRoleDetails.roleName);
    });
    it('Should successfully throw Database Error is error occurs in database', async () => {
      try {
        await dbCommandsAdmin.getBandIdFromName(null);
      } catch (e) {
        expect(e instanceof DatabaseError).equal(true);
        expect(e.message).to.include('Error calling getBandIdFromName with message');
      }
    });
  });
});
