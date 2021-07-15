const express = require('express');
const dbCommandsAdmin = require('../model/dbCommandsAdmin');

const router = express.Router();

router.get('/getAllBandNames', async (req, res) => {
  try {
    const results = await dbCommandsAdmin.getAllBandNames();
    res.send(results);
    res.status(200);
  } catch (e) {
    res.status(500);
    res.send('Error');
  }
});

module.exports = router;
