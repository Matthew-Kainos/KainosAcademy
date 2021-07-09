const chai = require('chai');
const DatabaseError = require('../../errors/DatabaseError');

const { expect } = chai;

const dbCommands = require('../../model/dbCommands');
const testDatabaseCommands = require('../../model/testDatabaseCommands');

const bandTestDetails = {
  bandId: 9000,
  name: 'TestName',
  level: 1,
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
};

const jobRoleTestDetails = {
  roleId: 9000,
  name: 'TestName',
  specSum: 'TestSpec_Sum',
  specLink: 'TestSpec_Link',
  capId: capabilityTestDetails.capId,
  bandId: bandTestDetails.bandId,
};

describe('dbCommands', async () => {
  beforeEach(async () => {
    await testDatabaseCommands.testInsertFamily(familyTestDetails);
    await testDatabaseCommands.testInsertBand(bandTestDetails);
    await testDatabaseCommands.testInsertCapability(capabilityTestDetails);
    await testDatabaseCommands.testInsertJobRole(jobRoleTestDetails);
  });

  afterEach(async () => {
    await testDatabaseCommands.testDeleteJobRole(jobRoleTestDetails.name);
    await testDatabaseCommands.testDeleteCapability(capabilityTestDetails.name);
    await testDatabaseCommands.testDeleteFamily(familyTestDetails.name);
    await testDatabaseCommands.testDeleteBand(bandTestDetails.name);
  });

  describe('getCapabilitiesBasedOnJobId', async () => {
    it('Should successfully return Capablity Name and Capability Id based on Job Role Id', async () => {
      const result = await dbCommands.getCapabilitiesBasedOnJobId(jobRoleTestDetails.roleId);
      expect(result[0].cap_id).equal(capabilityTestDetails.capId);
      expect(result[0].name).equal(capabilityTestDetails.name);
    });
    it('Should successfully throw Database Error if connection', async () => {
      try {
        await dbCommands.getCapabilitiesBasedOnJobId(null);
      } catch (e) {
        expect(e instanceof DatabaseError).equal(true);
        expect(e.message).to.include('Error calling getCapabilitiesBasedOnJobId with message');
      }
    });
  });
});
