const express = require('express');

const router = express.Router();
const dbCommands = require('../model/dbCommands');

const DatabaseError = require('../errors/DatabaseError');

router.get('/addBand', (req, res) => {
  try {
    console.log(req.body);
  } catch (e) {
    res.status(500);
    res.send('Error');
  }
});
// MY CODE
router.get('/competencies/:bandName', async (req, res) => {
  try {
    const { bandName } = req.params;
    const results = await dbCommands.getCompentenciesBasesOnBand(bandName);
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

// MY CODE
router.get('/checkIfBandExists/:bandName', async (req, res) => {
  try {
    const { bandName } = req.params;
    const results = await dbCommands.checkIfBandExists(bandName);
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
