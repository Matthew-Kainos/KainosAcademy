const express = require('express');

const router = express.Router();
// const dbCommands = require('../model/dbCommands');

// const DatabaseError = require('../errors/DatabaseError');

router.get('/addBand', (req, res) => {
  try {
    console.log(req.body);
  } catch (e) {
    res.status(500);
    res.send('Error');
  }
});

module.exports = router;
