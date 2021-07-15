const express = require('express');
const dbCommandsAdmin = require('../model/dbCommandsAdmin');

const router = express.Router();
const DatabaseError = require('../errors/DatabaseError');

router.get('/getAllBandNames', async (req, res) => {
  try {
    const results = await dbCommandsAdmin.getAllBandNames();
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

router.get('/addBand', (req, res) => {
  try {
    console.log(req.body);
  } catch (e) {
    res.status(500);
    res.send('Error');
  }
});

module.exports = router;
