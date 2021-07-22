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

const trainingTestDetails = {
  TrainId: 9010,
  Name: 'TestTrainingCourse',
};

const competencyLevelTestDetails = {
  TrainId: 9010,
  Name: 'TestCompetencyLevel',
  EquivalentRole: 'TestRoleName',
};

describe('dbCommandsAdmin', async () => {
  beforeEach(async () => {
    await testDatabaseCommands.testInsertFamily(familyTestDetails);
    await testDatabaseCommands.testInsertBand(bandTestDetails);
    await testDatabaseCommands.testInsertBand(additionalBandTestDetails);
    await testDatabaseCommands.testInsertCapability(capabilityTestDetails);
    await testDatabaseCommands.testInsertJobRole(jobRoleTestDetails);
    await testDatabaseCommands.testInsertJobRole(additionalJobRoleTestDetails);
    await testDatabaseCommands.testInsertTraining(trainingTestDetails);
    await testDatabaseCommands.testInsertCompetencyLevel(competencyLevelTestDetails);
  });

  afterEach(async () => {
    await testDatabaseCommands.testDeleteBandTraining(bandTestDetails.bandId);
    await testDatabaseCommands.testDeleteJobRole(additionalJobRoleTestDetails.name);
    await testDatabaseCommands.testDeleteJobRole(jobRoleTestDetails.name);
    await testDatabaseCommands.testDeleteCapability(capabilityTestDetails.name);
    await testDatabaseCommands.testDeleteFamily(familyTestDetails.name);
    await testDatabaseCommands.testDeleteBand(bandTestDetails.name);
    await testDatabaseCommands.testDeleteBand(additionalBandTestDetails.name);
    await testDatabaseCommands.testDeleteTraining(trainingTestDetails.Name);
    await testDatabaseCommands.testDeleteCompetencyLevel(competencyLevelTestDetails.Name);
    await testDatabaseCommands.testRestoreBandLevels();
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

  describe('addBandTests', async () => {
    describe('getTraining', async () => {
      it('Should successfully return the training courses available', async () => {
        const result = await dbCommandsAdmin.getTraining();
        expect(result.find((x) => x.Name === trainingTestDetails.Name).Name)
          .equal(trainingTestDetails.Name);
      });
    });

    describe('getCompetencies', async () => {
      it('Should successfully return the competency names', async () => {
        const result = await dbCommandsAdmin.getCompetencies();
        expect(result.find((x) => x.Name === competencyLevelTestDetails.Name).Name)
          .equal(competencyLevelTestDetails.Name);
      });
    });

    describe('getBandNames', async () => {
      it('Should successfully return the band names, no dupilcates', async () => {
        const result = await dbCommandsAdmin.getBandNames();
        expect(result.find((x) => x.Name === bandTestDetails.name).Name)
          .equal(bandTestDetails.name);
        expect(result.find((x) => x.Name === additionalBandTestDetails.name).Name)
          .equal(additionalBandTestDetails.name);
      });
    });

    describe('getBandLevel', async () => {
      it('Should successfully return the band level for a given band', async () => {
        const resultOne = await dbCommandsAdmin.getBandLevel(bandTestDetails.name);
        const resultTwo = await dbCommandsAdmin.getBandLevel(additionalBandTestDetails.name);
        expect(resultOne[0].Level).equal(bandTestDetails.level);
        expect(resultTwo[0].Level).equal(additionalBandTestDetails.level);
      });
      it('Should return no data for invalid band name', async () => {
        const result = await dbCommandsAdmin.getBandLevel('abc');
        expect(result.length).equal(0);
      });
      it('Should successfully throw Database Error if error occured in database', async () => {
        try {
          await dbCommandsAdmin.getBandLevel(null);
        } catch (e) {
          expect(e instanceof DatabaseError).equal(true);
          expect(e.message).to.include('Error calling getBandLevel with message');
        }
      });
    });

    describe('updateBandLevels', async () => {
      it('Should successfully return the band level for a given band', async () => {
        await dbCommandsAdmin.updateBandLevels(bandTestDetails.level);
        const resultOne = await dbCommandsAdmin.getBandLevel(bandTestDetails.name);
        const resultTwo = await dbCommandsAdmin.getBandLevel(additionalBandTestDetails.name);
        expect(resultOne[0].Level).equal(bandTestDetails.level + 1);
        expect(resultTwo[0].Level).equal(additionalBandTestDetails.level + 1);
      });
      it('Should successfully return the band level for a given band', async () => {
        await dbCommandsAdmin.updateBandLevels(additionalBandTestDetails.level);
        const resultOne = await dbCommandsAdmin.getBandLevel(bandTestDetails.name);
        const resultTwo = await dbCommandsAdmin.getBandLevel(additionalBandTestDetails.name);
        expect(resultOne[0].Level).equal(bandTestDetails.level);
        expect(resultTwo[0].Level).equal(additionalBandTestDetails.level + 1);
      });
      it('Should successfully throw Database Error if error occured in database', async () => {
        try {
          await dbCommandsAdmin.updateBandLevels(null);
        } catch (e) {
          expect(e instanceof DatabaseError).equal(true);
          expect(e.message).to.include('Error calling updateBandLevels with message');
        }
      });
    });

    describe('setTrainingForBand', async () => {
      it('Should successfully add training and band in band_training table', async () => {
        await dbCommandsAdmin.setTrainingForBand(trainingTestDetails.TrainId,
          bandTestDetails.bandId);
        const results = await testDatabaseCommands.getBandTrainingTable();
        expect(results.find((x) => x.Train_ID === trainingTestDetails.TrainId).Band_ID)
          .equal(bandTestDetails.bandId);
      });
      it('Should successfully throw Database Error if error occured in database', async () => {
        try {
          await dbCommandsAdmin.setTrainingForBand(null, null);
        } catch (e) {
          expect(e instanceof DatabaseError).equal(true);
          expect(e.message).to.include('Error calling setTrainingForBand with message');
        }
      });
    });

    describe('addBand', async () => {
      it('Should successfully add new band ', async () => {
        const newBandDetails = {
          Name: 'NewTestBandOneFour',
          Level: 3,
          Training: 'TestTraining',
          Competencies: 'TestCompetencies',
          Responsibilities: 'TestResponsibilities',
        };
        await dbCommandsAdmin.addBand(newBandDetails);
        const result = await dbCommandsAdmin.getBandNames();
        expect(result.find((x) => x.Name === newBandDetails.Name).Name)
          .equal(newBandDetails.Name);
      });
      it('Should successfully throw Database Error if error occured in database', async () => {
        try {
          await dbCommandsAdmin.addBand(null);
        } catch (e) {
          expect(e instanceof DatabaseError).equal(true);
          expect(e.message).to.include('Error calling addBand with message');
        }
      });
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
  describe('deleteARole', async () => {
    it('Should successfully delete a role', async () => {
      const newRoleDetails = {
        roleName: 'TestRole2',
        specSum: 'mySum',
        specLink: 'link',
        capId: capabilityTestDetails.capId,
        bandId: bandTestDetails.bandId,
      };
      await dbCommandsAdmin.addNewRole(newRoleDetails);
      await dbCommandsAdmin.deleteARole(newRoleDetails.roleName);
      const result = await dbCommandsAdmin.checkIfUserExists(newRoleDetails.roleName);
      expect(result.length).to.equal(0);
    });
    it('Should successfully throw Database Error is error occurs in database', async () => {
      try {
        await dbCommandsAdmin.deleteARole(null);
      } catch (e) {
        expect(e instanceof DatabaseError).equal(true);
        expect(e.message).to.include('Error calling deleteARole with message');
      }
    });
  });
});
