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
      res.send({ success: true, message: 'New Role Added' });
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
