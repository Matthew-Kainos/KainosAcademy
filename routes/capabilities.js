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

router.get('/family/:capName', async (req, res) => {
  try {
    const { capName } = req.params;
    const results = await dbCommands.getFamilyBasedOnCapability(capName);
    res.send(results);
    res.status(200);
  } catch (e) {
    res.status(500);
    res.send('Error');
    if (e instanceof DatabaseError) {
      res.send('Database Error');
      console.error(e.message);
    }
    res.send('Error');
    console.error(e.message);
  }
});

router.get('/findByJobId/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const results = await dbCommands.getCapabilitiesBasedOnJobId(jobId);
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

router.get('/findByJobName/:jobName', async (req, res) => {
  try {
    const name = req.params.jobName;
    const results = await dbCommands.getCapabilitiesBasedOnJobName(`%${name}%`);
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

router.get('/checkIfCapabilityExists/:capName', async (req, res) => {
  try {
    const { capName } = req.params;
    const results = await dbCommands.checkIfCapabilityExists(capName);
    res.status(200);
    if (results.length > 0) {
      res.send(JSON.stringify(true));
    } else {
      res.send(JSON.stringify(false));
    }
  } catch (e) {
    res.status(500);
    res.send('Error');
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

module.exports = router;
