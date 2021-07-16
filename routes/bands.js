const express = require('express');

const router = express.Router();
// const dbCommands = require('../model/dbCommands');

// const DatabaseError = require('../errors/DatabaseError');

router.get('/addBand', (req, res) => {
  try {
    const { BandData } = req.params;
    const results = await dbCommands.checkIfJobIdExists(jobID);
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

module.exports = router;
