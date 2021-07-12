const chai = require('chai');  
const DatabaseError = require('../../errors/DatabaseError');
const expect = chai.expect;

const dbCommands = require('../../model/dbCommands');  
const testDatabaseCommands = require('../../model/testDatabaseCommands');  

const bandTestDetails = {
  bandId: 9000,
  name: "TestName",
  level: 1,
  training: "TestTraining",
  compentencies: "TestCompetencies",
  responsibilities: "TestResponsibilities",
}

const familyTestDetails = {
  familyId: 9000,
  name: "TestName",
}

const capabilityTestDetails = {
  capId: 9000,
  name: "TestName",
  jobFamily: "TestJobFamily",
  leadName: "TestLeadName",
  leadMessage: "TestLeadMessage",
  familyId: familyTestDetails.familyId,
}

const jobRoleTestDetails = {
  roleId: 9000,
  name: "TestName",
  specSum: "TestSpec_Sum",
  specLink: "TestSpec_Link",
  capId: capabilityTestDetails.capId,
  bandId: bandTestDetails.bandId,
}

describe('dbCommands', async function() {
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

  describe('checkIfJobExists', async function() {
    it('Should successfully return job role details if job exists using full name to query', async function() {
      const result = await dbCommands.checkIfJobExists(jobRoleTestDetails.name);
      expect(result[0].Name).equal(jobRoleTestDetails.name);
    });
    it('Should successfully return job role details if job exists using partial name to query', async function() {
      const result = await dbCommands.checkIfJobExists('%Test%');
      expect(result[0].Name).equal(jobRoleTestDetails.name);
    });
    it('Should successfully return empty result if job name is not valid', async function() {
      const result = await dbCommands.checkIfJobExists('abc');
      expect(result.length).equal(0);
    });
    it('Should successfully throw Database Error if error occured in database', async function() {
      try{     
        await dbCommands.checkIfJobExists(null);
      } catch(e){
        expect(e instanceof DatabaseError).equal(true);
        expect(e.message).to.include('Error calling checkIfJobExists with message');
      }
    });
  });

  describe('getCapabilitiesBasedOnJobName', async function() {
    it('Should successfully return Capablity Name and Capability Id based on Job Role Name', async function() {
      const result = await dbCommands.getCapabilitiesBasedOnJobName(jobRoleTestDetails.name);
      expect(result[0].cap_id).equal(capabilityTestDetails.capId);
      expect(result[0].JobRoleName).equal(capabilityTestDetails.name);
    });
    it('Should successfully throw Database Error if error occured in database', async function() {
      try{     
        await dbCommands.getCapabilitiesBasedOnJobName(null);
      } catch(e){
        expect(e instanceof DatabaseError).equal(true);
        expect(e.message).to.include('Error calling getCapabilitiesBasedOnJobName with message');
      }
    });
  });

  describe('getAllJobsWithCapability', async function() {
    it('Should successfully return all Jobs with Capablity Name and Capability Id', async function() {
      const result = await dbCommands.getAllJobsWithCapability();
      expect(result[result.length-1].cap_id).equal(capabilityTestDetails.capId);
      expect(result[result.length-1].CapabilityName).equal(capabilityTestDetails.name);
      expect(result[result.length-1].JobRoleName).equal(jobRoleTestDetails.name);
    });
  });

})