const express = require('express');

const router = express.Router();
const dbCommandsAdmin = require('../model/dbCommandsAdmin');
const DatabaseError = require('../errors/DatabaseError');

router.get('/checkIfUserExists/:username', async (req, res) => {
  try {
    const { username } = req.params;
    console.log(username);
    const results = await dbCommandsAdmin.checkIfUserExists(username);
    console.log(results);
    res.status(200);
    if (results.length > 0) {
      res.send(true);
    } else {
      res.send(false);
    }
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

router.post('/getPassword', async (req, res) => {
  try {
    const { username } = req.body;
    const results = await dbCommandsAdmin.getUsersPassword(username);
    res.status(200);
    res.send(results[0].Password);
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

router.get('/checkIfAdmin/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const results = await dbCommandsAdmin.checkIfAdmin(username);
    res.status(200);
    if (results.length > 0) {
      res.send(true);
    } else {
      res.send(false);
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
