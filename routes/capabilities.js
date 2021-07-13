const express = require('express');

const router = express.Router();
const dbCommands = require('../model/dbCommands');
const DatabaseError = require('../errors/DatabaseError');

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
    res.send('Hello');
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
    console.log(results);
    res.send(results);
    res.status(200);
  } catch (e) {
    res.status(500);
    res.send('Error');
    console.error(e.message);
  }
});

module.exports = router;
