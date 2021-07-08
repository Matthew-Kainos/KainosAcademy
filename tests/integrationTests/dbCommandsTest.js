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

  describe('getCapabilitiesBasedOnJobId', async function() {
    it('Should successfully return Capablity Name and Capability Id based on Job Role Id', async function() {
      const result = await dbCommands.getCapabilitiesBasedOnJobId(jobRoleTestDetails.roleId);
      expect(result[0].cap_id).equal(capabilityTestDetails.capId);
      expect(result[0].name).equal(capabilityTestDetails.name);
    });
    it('Should successfully throw Database Error if connection', async function() {
      try{     
        await dbCommands.getCapabilitiesBasedOnJobId(null);
      } catch(e){
        expect(e instanceof DatabaseError).equal(true);
        expect(e.message).to.include('Error calling getCapabilitiesBasedOnJobId with message');
      }
    });
  });

  describe('getJobSpec', async function() {
    it('Should successfully return the Job Specefication Name, ID, Specification Summary and Specification link based on Job Role Id', async function() {
      const result = await dbCommands.getJobSpec(jobRoleTestDetails.roleId);
      expect(result[0].Name).equal(jobRoleTestDetails.name);
      expect(result[0].Spec_Sum).equal(jobRoleTestDetails.specSum);
      expect(result[0].Spec_Link).equal(jobRoleTestDetails.specLink);

    });
    it('Should successfully throw Database Error if connection', async function() {
      try{     
        await dbCommands.getJobSpec(null);
      } catch(e){
        expect(e instanceof DatabaseError).equal(true);
        expect(e.message).to.include('Error calling getJobSpec with message');
      }
    });
  });

})