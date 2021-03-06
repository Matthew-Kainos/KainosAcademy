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
    const results = await dbCommands.checkIfBandExists(newBandDetails.bandName);
    if (results.length === 0) {
      let newLevel;
      if (newBandDetails.bandPlace === 'bandAbove') {
        const level = await dbCommandsAdmin.getBandLevel(newBandDetails.bands);
        newLevel = Number(level[0].Level);
      } else if (newBandDetails.bandPlace === 'bandBelow') {
        const level = await dbCommandsAdmin.getBandLevel(newBandDetails.bands);
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
      res.send({ success: true, message: `New Band ${newBandDetails.bandName} Added` });
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

router.post('/capability', async (req, res) => {
  try {
    const { newCapabilityDetails } = req.body;
    const results = await dbCommands.checkIfCapabilityExists(newCapabilityDetails.Name);
    if (results.length === 0) {
      const capabilityDetails = {
        name: newCapabilityDetails.Name,
      };
      await dbCommandsAdmin.addNewCapability(capabilityDetails);
      res.send({ success: true, message: `New Capability ${capabilityDetails.name} Added` });
      res.status(200);
    } else {
      res.send({ success: false, message: 'Unable to add Capability due to Duplicate Capability Name' });
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

router.post('/family', async (req, res) => {
  try {
    const { newFamilyDetails } = req.body;
    const results = await dbCommands.checkIfFamilyExists(newFamilyDetails.FamilyName);
    const capbailityId = await dbCommandsAdmin.getCapabilityIdFromName(newFamilyDetails.Capability);
    if (results.length === 0) {
      const newFamily = {
        familyName: newFamilyDetails.FamilyName,
        leadName: newFamilyDetails.LeadName,
        leadMessage: newFamilyDetails.LeadMessage,
        leadImage: newFamilyDetails.LeadImage,
        capId: capbailityId[0].Cap_ID,
      };
      console.log(newFamilyDetails);
      await dbCommandsAdmin.addNewFamily(newFamily);
      res.send({ success: true, message: `New Family ${newFamilyDetails.FamilyName} Added` });
      res.status(200);
    } else {
      res.send({ success: false, message: 'Unable to add Family due to Duplicate Family Name' });
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
