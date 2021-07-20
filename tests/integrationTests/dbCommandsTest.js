/* eslint-disable eqeqeq */
/* eslint-disable max-len */
const chai = require('chai');
const DatabaseError = require('../../errors/DatabaseError');

const { expect } = chai;

const dbCommands = require('../../model/dbCommands');
const dbCommandsAdmin = require('../../model/dbCommandsAdmin');
const testDatabaseCommands = require('../../model/testDatabaseCommands');

const adminUserTestDetails = {
  username: 'AdminTestUser',
  password: 'Secret123',
  isAdmin: true,
};

const userTestDetails = {
  username: 'TestUser',
  password: 'Secret456',
  isAdmin: false,
};

const bandTestDetails = {
  bandId: 9000,
  name: 'TestName',
  level: 1,
  training: 'TestTraining',
  competencies: 'TestCompetencies',
  responsibilities: 'TestResponsibilities',
};

const additionalBandTestDetails = {
  bandId: 9001,
  name: 'TestNameBandTwo',
  level: 2,
  training: 'TestTraining',
  competencies: 'TestCompetencies',
  responsibilities: 'TestResponsibilities',
};
// ADDED
const competenciesTestDetails = {
  trainId: 100,
  name: 'testName',
};

const capabilityTestDetails = {
  capId: 9000,
  name: 'TestName',
};

const familyTestDetails = {
  familyId: 9000,
  name: 'TestName',
  leadName: 'TestLeadName',
  leadMessage: 'TestLeadMessage',
  capId: capabilityTestDetails.capId,
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
    await testDatabaseCommands.testInsertUser(userTestDetails);
    await testDatabaseCommands.testInsertUser(adminUserTestDetails);
    await testDatabaseCommands.testInsertCapability(capabilityTestDetails);
    await testDatabaseCommands.testInsertFamily(familyTestDetails);
    await testDatabaseCommands.testInsertBand(bandTestDetails);
    await testDatabaseCommands.testInsertBand(additionalBandTestDetails);
    await testDatabaseCommands.testInsertJobRole(jobRoleTestDetails);
    await testDatabaseCommands.testInsertJobRole(additionalJobRoleTestDetails);
  });

  afterEach(async () => {
    await testDatabaseCommands.testDeleteUser(userTestDetails.username);
    await testDatabaseCommands.testDeleteUser(adminUserTestDetails.username);
    await testDatabaseCommands.testDeleteJobRole(additionalJobRoleTestDetails.name);
    await testDatabaseCommands.testDeleteJobRole(jobRoleTestDetails.name);
    await testDatabaseCommands.testDeleteFamily(familyTestDetails.name);
    await testDatabaseCommands.testDeleteBand(bandTestDetails.name);
    await testDatabaseCommands.testDeleteBand(additionalBandTestDetails.name);
    await testDatabaseCommands.testDeleteCapability(capabilityTestDetails.name);
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
      expect(result.find((x) => x.Role == jobRoleTestDetails.name).Role).equal(jobRoleTestDetails.name);
      expect(result.find((x) => x.Role == jobRoleTestDetails.name).RoleBand).equal(bandTestDetails.name);
      expect(result.find((x) => x.Role == additionalJobRoleTestDetails.name).Role).equal(additionalJobRoleTestDetails.name);
      expect(result.find((x) => x.Role == additionalJobRoleTestDetails.name).RoleBand).equal(additionalBandTestDetails.name);
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

  describe('getJobRoles', async () => {
    it('Should successfully show all list Role_ID and Name from JobRoles Table order by Band Level', async () => {
      const result = await dbCommands.getJobRoles();
      expect(result.find((x) => x.Role_ID === jobRoleTestDetails.roleId).Role_ID)
        .equal(jobRoleTestDetails.roleId);
      expect(result.find((x) => x.Name === jobRoleTestDetails.name).Name)
        .equal(jobRoleTestDetails.name);
    });
    it('Should successfully throw Database Error if connection', async () => {
      try {
        await dbCommands.getJobRoles(null);
      } catch (e) {
        expect(e instanceof DatabaseError).equal(true);
        expect(e.message).to.include('Error calling getJobRoles with message');
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
      expect(result[result.length - 1].Job_Family).equal(familyTestDetails.name);
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
      expect(result[result.length - 1].JobRoleName).equal(additionalJobRoleTestDetails.name);
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
  describe('checkIfUserExists', async () => {
    it('Should successfully return the Username if User exists', async () => {
      const result = await dbCommandsAdmin.checkIfUserExists(userTestDetails.username);
      expect(result.length).equal(1);
      expect(result[0].Username).equal(userTestDetails.username);
    });

    it('Should successfully throw Database Error if db error occured', async () => {
      try {
        await dbCommandsAdmin.checkIfUserExists(null);
      } catch (e) {
        expect(e instanceof DatabaseError).equal(true);
        expect(e.message).to.include('Error calling checkIfUserExists with message');
      }
    });
  });

  describe('getUsersPassword', async () => {
    it('Should successfully return the Password of User', async () => {
      const result = await dbCommandsAdmin.getUsersPassword(userTestDetails.username);
      expect(result.length).equal(1);
      expect(result[0].Password).equal(userTestDetails.password);
    });

    it('Should successfully throw Database Error if db error occured', async () => {
      try {
        await dbCommandsAdmin.getUsersPassword(null);
      } catch (e) {
        expect(e instanceof DatabaseError).equal(true);
        expect(e.message).to.include('Error calling getUsersPassword with message');
      }
    });
  });
  describe('checkIfAdmin', async () => {
    it('Should successfully return details if user an admin', async () => {
      const result = await dbCommandsAdmin.checkIfAdmin(adminUserTestDetails.username);
      expect(result.length).equal(1);
      expect(result[0].Username).equal(adminUserTestDetails.username);
      expect(result[0].Password).equal(adminUserTestDetails.password);
      expect(result[0].isAdmin).equal(1);
    });

    it('Should successfully return no results if user an is not an admin', async () => {
      const result = await dbCommandsAdmin.checkIfAdmin(userTestDetails.username);
      expect(result.length).equal(0);
    });

    it('Should successfully throw Database Error if db error occured', async () => {
      try {
        await dbCommandsAdmin.checkIfAdmin(null);
      } catch (e) {
        expect(e instanceof DatabaseError).equal(true);
        expect(e.message).to.include('Error calling getUsersPassword with message');
      }
    });
  });

  describe('getAllFamiliesWithCapability', async () => {
    it('Should successfully return all families with the relevant Capability Name', async () => {
      const result = await dbCommands.getAllFamiliesWithCapability();
      expect(result.find((x) => x.Name == capabilityTestDetails.name).Name).equal(capabilityTestDetails.name);
      expect(result.find((x) => x.Job_Family == familyTestDetails.name).Job_Family).equal(familyTestDetails.name);
      // expect(result[result.length - 1].Name).equal(capabilityTestDetails.name);
      // expect(result[result.length - 1].Job_Family).equal(familyTestDetails.name);
    });
  });

  describe('getCapabilityLead', async () => {
    it('Should successfully return information about the capability lead', async () => {
      const result = await dbCommands.getCapabilityLead(capabilityTestDetails.capId);
      expect(result[result.length - 1].LeadName).equal(familyTestDetails.leadName);
      expect(result[result.length - 1].LeadMessage).equal(familyTestDetails.leadMessage);
    });
  });

  // MY CODE FIX
  describe('getAllBandsAndCompetencies', async () => {
    it('Should successfully return Competencies based on Band', async () => {
      const result = await dbCommands.getAllBandsAndCompetencies(bandTestDetails.name);
      expect(result[0].Name).equal(bandTestDetails.name);
      expect(result[0].Name).equal(competenciesTestDetails.name);
    });
    it('Should successfully throw Database Error if connection', async () => {
      try {
        await dbCommands.getAllBandsAndCompetencies(null);
      } catch (e) {
        expect(e instanceof DatabaseError).equal(true);
        expect(e.message).to.include('Error calling getAllBandsAndCompetencies with message');
      }
    });
  });
});
