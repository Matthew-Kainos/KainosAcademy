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

const additionalBandTestDetails = {
  bandId: 9001,
  name: "TestNameBandTwo",
  level: 2,
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

const additionalJobRoleTestDetails = {
  roleId: 9001,
  name: "TestNameTwo",
  specSum: "TestSpec_Sum",
  specLink: "TestSpec_Link",
  capId: capabilityTestDetails.capId,
  bandId: additionalBandTestDetails.bandId,
}

describe('dbCommands', async function() {
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

  describe('getRoleAndBandDB', async function() {
    it('Should successfully return role name and role band by the enter role name', async function() {
      const result = await dbCommands.getRoleAndBandDB(jobRoleTestDetails.name)
      expect(result[0].Role).equal(jobRoleTestDetails.name);
      expect(result[0].RoleBand).equal(bandTestDetails.name);
    });
    it('Should successfully throw Database Error if connection', async function() {
      try{     
        await dbCommands.getRoleAndBandDB(null);
      } catch(e){
        expect(e instanceof DatabaseError).equal(true);
        expect(e.message).to.include('Error calling getRoleAndBandDB with message');
      }
    });
  });

  describe('getAllRolesAndBandDB', async function() {
    it('Should successfully return role name and role band by the enter role name', async function() {
      const result = await dbCommands.getAllRolesAndBandDB(jobRoleTestDetails.name)
      expect(result[0].Role).equal(jobRoleTestDetails.name);
      expect(result[0].RoleBand).equal(bandTestDetails.name);
      expect(result[1].Role).equal(additionalJobRoleTestDetails.name);
      expect(result[1].RoleBand).equal(additionalBandTestDetails.name);
    });
    it('Should successfully throw Database Error if connection', async function() {
      try{     
        await dbCommands.getAllRolesAndBandDB(null);
      } catch(e){
        expect(e instanceof DatabaseError).equal(true);
        expect(e.message).to.include('Error calling getAllRolesAndBandDB with message');
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
})