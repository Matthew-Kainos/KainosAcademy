const express = require('express');

const router = express.Router();
const dbCommands = require('../model/dbCommands');
const DatabaseError = require('../errors/DatabaseError');

router.get('/job-roles', async (req, res) => {
  try {
    const dbResults = await dbCommands.getJobRoles();
    res.send(dbResults);
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

router.get('/band', async (req, res) => {
  try {
    const results = await dbCommands.getAllRolesAndBandDB();
    res.send(results);
    res.status(200);
  } catch (e) {
    res.status(500);
    res.send('Error');
  }
});

router.get('/checkIfJobExists/:jobName', async (req, res) => {
  try {
    const { jobName } = req.params;
    console.log(jobName);
    const results = await dbCommands.checkIfJobExists(`${jobName}`);
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

router.get('/getAllJobsWithCapability', async (req, res) => {
  try {
    const results = await dbCommands.getAllJobsWithCapability();
    res.send(results);
  } catch (e) {
    res.status(500);
    res.send('Error');
  }
});

router.get('/jobSpec/:roleID', async (req, res) => {
  try {
    const { roleID } = req.params;
    const dbResults = await dbCommands.getJobSpec(roleID);
    res.send(dbResults);
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
