const express = require('express');

const router = express.Router();
const dbCommands = require('../model/dbCommands');
const dbCommandsAdmin = require('../model/dbCommandsAdmin');
const DatabaseError = require('../errors/DatabaseError');

router.get('/getAllCapabilityNames', async (req, res) => {
  try {
    const results = await dbCommandsAdmin.getAllCapabilityNames();
    res.send(results);
    res.status(200);
  } catch (e) {
    if (e instanceof DatabaseError) {
      res.send('Database Error');
      console.error(e.message);
    }
    res.send('Error');
    console.error(e.message);
  }
});

router.get('/getAllFamiliesWithCapability', async (req, res) => {
  try {
    const results = await dbCommands.getAllFamiliesWithCapability();
    res.send(results);
    res.status(200);
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

router.get('/viewCapabilityLead/:capID', async (req, res) => {
  try {
    const { capID } = req.params;
    const results = await dbCommands.getCapabilityLead(capID);
    res.send(results);
    res.status(200);
  } catch (e) {
    res.status(500);
    res.send('Error');
    console.error(e.message);
  }
});

module.exports = router;
