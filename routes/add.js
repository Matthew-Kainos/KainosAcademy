const express = require('express');

const router = express.Router();
const dbCommands = require('../model/dbCommands');
const dbCommandsAdmin = require('../model/dbCommandsAdmin');
const addBandController = require('../controller/addBandController');

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
    const { newBandDetails } = req.body;
    const results = await dbCommands.checkIfBandExists(newBandDetails.name);
    if (results.length === 0) {
      let newLevel;
      if (newBandDetails.aboveOrBelow === 'bandAbove') {
        const level = await dbCommandsAdmin.getBandLevel(newBandDetails.refBand);
        newLevel = Number(level[0].Level);
      } else if (newBandDetails.aboveOrBelow === 'bandBelow') {
        const level = await dbCommandsAdmin.getBandLevel(newBandDetails.refBand);
        newLevel = Number(level[0].Level) + 1;
      } else {
        res.send({ success: false, message: "Placement wasn't set" });
        res.status(400);
      }
      if (newLevel !== null) {
        await dbCommandsAdmin.updateBandLevels(newLevel);
        const data = addBandController.setAddBandQueryData(newBandDetails, newLevel);
        await dbCommandsAdmin.addBand(data);
        await addBandController.setTrainingforBand(newBandDetails, dbCommands, dbCommandsAdmin);
      }
      res.send({ success: true, message: `New Band ${newBandDetails.name} Added` });
      res.status(200);
    } else {
      res.send({ success: false, message: 'Unable to add Band due to Duplicate Band Name' });
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
