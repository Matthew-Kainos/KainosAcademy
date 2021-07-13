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

describe('dbCommands', async () => {
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

  describe('getRoleAndBandDB', async () => {
    it('Should successfully return role name and role band by the enter role name', async () => {
      const result = await dbCommands.getRoleAndBandDB(jobRoleTestDetails.name);
      expect(result[0].Role).equal(jobRoleTestDetails.name);
      expect(result[0].RoleBand).equal(bandTestDetails.name);
    });
    it('Should successfully throw Database Error if connection', async () => {
      try {
        await dbCommands.getRoleAndBandDB(null);
      } catch (e) {
        expect(e instanceof DatabaseError).equal(true);
        expect(e.message).to.include('Error calling getRoleAndBandDB with message');
      }
    });
  });

  describe('getAllRolesAndBandDB', async () => {
    it('Should successfully return role name and role band by the enter role name', async () => {
      const result = await dbCommands.getAllRolesAndBandDB(jobRoleTestDetails.name);
      expect(result.find((x) => x.Role === jobRoleTestDetails.name).Role)
        .equal(jobRoleTestDetails.name);
      expect(result.find((x) => x.Role === jobRoleTestDetails.name).RoleBand)
        .equal(bandTestDetails.name);
      expect(result.find((x) => x.Role === additionalJobRoleTestDetails.name).Role)
        .equal(additionalJobRoleTestDetails.name);
      expect(result.find((x) => x.Role === additionalJobRoleTestDetails.name).RoleBand)
        .equal(additionalBandTestDetails.name);
    });
    it('Should successfully throw Database Error if connection', async () => {
      try {
        await dbCommands.getAllRolesAndBandDB(null);
      } catch (e) {
        expect(e instanceof DatabaseError).equal(true);
        expect(e.message).to.include('Error calling getAllRolesAndBandDB with message');
      }
    });
  });

  describe('checkIfJobExists', async () => {
    it('Should successfully return job role details if job exists using full name to query', async () => {
      const result = await dbCommands.checkIfJobExists(jobRoleTestDetails.name);
      expect(result[0].Name).equal(jobRoleTestDetails.name);
    });
    it('Should successfully return job role details if job exists using partial name to query', async () => {
      const result = await dbCommands.checkIfJobExists('%Test%');
      expect(result[0].Name).equal(jobRoleTestDetails.name);
    });
    it('Should successfully return empty result if job name is not valid', async () => {
      const result = await dbCommands.checkIfJobExists('abc');
      expect(result.length).equal(0);
    });
    it('Should successfully throw Database Error if error occured in database', async () => {
      try {
        await dbCommands.checkIfJobExists(null);
      } catch (e) {
        expect(e instanceof DatabaseError).equal(true);
        expect(e.message).to.include('Error calling checkIfJobExists with message');
      }
    });
  });

  describe('getCapabilitiesBasedOnJobName', async () => {
    it('Should successfully return Capablity Name and Capability Id based on Job Role Name', async () => {
      const result = await dbCommands.getCapabilitiesBasedOnJobName(jobRoleTestDetails.name);
      expect(result[0].cap_id).equal(capabilityTestDetails.capId);
      expect(result[0].JobRoleName).equal(capabilityTestDetails.name);
    });
    it('Should successfully throw Database Error if error occured in database', async () => {
      try {
        await dbCommands.getCapabilitiesBasedOnJobName(null);
      } catch (e) {
        expect(e instanceof DatabaseError).equal(true);
        expect(e.message).to.include('Error calling getCapabilitiesBasedOnJobName with message');
      }
    });
  });

  describe('getFamilyBasedOnCapability', async () => {
    it('Should successfully return Family based on Capability Name', async () => {
      const result = await dbCommands.getFamilyBasedOnCapability(capabilityTestDetails.name);
      console.log(result);
      expect(result[0].Job_Family).equal(capabilityTestDetails.jobFamily);
      expect(result[0].Name).equal(capabilityTestDetails.name);
    });
    it('Should successfully throw Database Error if connection', async () => {
      try {
        await dbCommands.getFamilyBasedOnCapability(null);
      } catch (e) {
        expect(e instanceof DatabaseError).equal(true);
        expect(e.message).to.include('Error calling getFamilyBasedOnCapability with message');
      }
    });
  });

  describe('getAllJobsWithCapability', async () => {
    it('Should successfully return all Jobs with Capablity Name and Capability Id', async () => {
      const result = await dbCommands.getAllJobsWithCapability();
      expect(result[result.length - 1].cap_id).equal(capabilityTestDetails.capId);
      expect(result[result.length - 1].CapabilityName).equal(capabilityTestDetails.name);
      expect(result[result.length - 1].JobRoleName).equal(jobRoleTestDetails.name);
    });
  });

  describe('getJobSpec', async () => {
    it('Should successfully return the Job Specefication Name, ID, Specification Summary and Specification link based on Job Role Id', async () => {
      const result = await dbCommands.getJobSpec(jobRoleTestDetails.roleId);
      expect(result[0].Name).equal(jobRoleTestDetails.name);
      expect(result[0].Spec_Sum).equal(jobRoleTestDetails.specSum);
      expect(result[0].Spec_Link).equal(jobRoleTestDetails.specLink);
    });
    it('Should successfully throw Database Error if connection', async () => {
      try {
        await dbCommands.getJobSpec(null);
      } catch (e) {
        expect(e instanceof DatabaseError).equal(true);
        expect(e.message).to.include('Error calling getJobSpec with message');
      }
    });
  });
});
