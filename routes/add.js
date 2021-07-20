const express = require('express');

const router = express.Router();
const dbCommands = require('../model/dbCommands');
const dbCommandsAdmin = require('../model/dbCommandsAdmin');

const DatabaseError = require('../errors/DatabaseError');

router.post('/role', async (req, res) => {
  try {
    const { newRoleDetails } = req.body;
    const results = await dbCommands.checkIfJobExists(newRoleDetails.RoleName);
    if (results.length === 0) {
      const capbailityId = await dbCommandsAdmin.getCapabilityIdFromName(newRoleDetails.Capability);
      const bandId = await dbCommandsAdmin.getBandIdFromName(newRoleDetails.Band);
      const newRole = {
        roleName: newRoleDetails.RoleName,
        specSum: newRoleDetails.SpecSum,
        specLink: newRoleDetails.SpecLink,
        capId: capbailityId[0].Cap_ID,
        bandId: bandId[0].BandID,
      };
      await dbCommandsAdmin.addNewRole(newRole);
      res.send({ success: true, message: `New Role ${newRoleDetails.RoleName} Added` });
      res.status(200);
    } else {
      res.send({ success: false, message: 'Unable to add Role due to Duplicate Role Name' });
      res.status(400);
    }
  } catch (e) {
    res.status(500);
    if (e instanceof DatabaseError) {
      res.send('Database Error');
      console.error(e.message);
    }
    res.send('Error');
    console.error(e.message);
  }
});

router.post('/band', async (req, res) => {
  try {
    const newBandDetails = req.body;
    const results = await dbCommands.checkIfBandExists(newBandDetails.name);
    if (results.length === 0) {
      if (newBandDetails.aboveOrBelow === 'bandAbove') {
        const level = await dbCommandsAdmin.getBandLevel(newBandDetails.refBand);
        await dbCommandsAdmin.updateBandLevels(level[0].Level);
        const data = {
          Name: newBandDetails.name,
          Level: level[0].Level,
          Training: newBandDetails.training.toString(),
          Competencies: newBandDetails.competencies,
          Responsibilities: newBandDetails.responsiblities,
        };
        await dbCommandsAdmin.addBand(data);
        const bandID = await dbCommands.getBandID(newBandDetails.name);
        for (var i = 0; i < newBandDetails.training.length; i++) {
          const trainID = await dbCommands.getTrainingID(newBandDetails.training[i]);
          console.log(trainID);
          console.log(bandID);
          await dbCommandsAdmin.setTrainingForBand(trainID[0].Train_ID, bandID[0].Band_ID);
        }
      } else if (newBandDetails.aboveOrBelow === 'bandBelow') {
        const level = await dbCommandsAdmin.getBandLevel(newBandDetails.refBand);
        const newLevel = Number(level[0].Level) + 1;
        await dbCommandsAdmin.updateBandLevels(newLevel.toString());
        const data = {
          Name: newBandDetails.name,
          Level: newLevel.toString(),
          Training: newBandDetails.training.toString(),
          Competencies: newBandDetails.competencies,
          Responsibilities: newBandDetails.responsiblities,
        };
        await dbCommandsAdmin.addBand(data);
        const bandID = await dbCommands.getBandID(newBandDetails.name);
        for (var i = 0; i < training.length; i++) {
          const trainID = await dbCommands.getTrainingID(newBandDetails.training[i]);
          await dbCommandsAdmin.setTrainingForBand(trainID[0].Train_ID, bandID[0].Band_ID);
        }
      } else { console.log('ERROR PROCESSING - Placement not set'); }
      res.send({ success: true, message: `New Band ${newBandDetails.name} Added` });
      res.status(200);
    } else {
      res.send({ success: false, message: 'Unable to add Role due to Duplicate Role Name' });
      res.status(400);
    }
  } catch (e) {
    res.status(500);
    if (e instanceof DatabaseError) {
      res.send('Database Error');
      console.error(e.message);
    }
    res.send('Error');
    console.error(e.message);
  }
});

module.exports = router;
