const express = require('express');
const dbCommandsAdmin = require('../model/dbCommandsAdmin');

const router = express.Router();
const dbCommands = require('../model/dbCommands');

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

router.get('/info', async (req, res) => {
  try {
    const bandNames = await dbCommandsAdmin.getBandNames();
    const Names = bandNames.map((element) => element.Name);
    const bandComp = await dbCommandsAdmin.getCompetencies();
    const Competencies = bandComp.map((element) => element.Name);
    const bandTraining = await dbCommandsAdmin.getTraining();
    const Training = bandTraining.map((element) => element.Name);
    const results = {
      names: Names,
      competencies: Competencies,
      training: Training,
    };
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
// MY CODE- MIGHT NEED DELETED
router.get('/competencies/:bandName', async (req, res) => {
  try {
    const { bandName } = req.params;
    const results = await dbCommands.getCompetenciesBasedOnBand(bandName);
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

// MY CODE- MAY NOT BE RELEVANT
/* router.get('/checkIfBandExists/:bandName', async (req, res) => {
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
}); */

// MY CODE
router.get('/getBandCompetencies', async (req, res) => {
  try {
    const results = await dbCommands.getAllBandsAndCompetencies();
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

router.get('/getAllCompetencies', async (req, res) => {
  try {
    const results = await dbCommands.getAllCompetencies();
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

/* router.get('/getAllBandNames', async (req, res) => {
  try {
    const results = await dbCommands.getAllBandNames();
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
}); */

module.exports = router;
