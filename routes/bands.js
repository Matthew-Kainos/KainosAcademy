const express = require('express');
const dbCommandsAdmin = require('../model/dbCommandsAdmin');

const router = express.Router();
const dbCommands = require('../model/dbCommands');
const DatabaseError = require('../errors/DatabaseError');

router.post('/addBand', async (req, res) => {
  try {
    if (req.body.aboveOrBelow === 'bandAbove') {
      const level = await dbCommands.getBandLevel(req.body.refBand);
      await dbCommands.updateBandLevels(level[0].Level);
      const data = {
        Name: req.body.name,
        Level: level[0].Level,
        Training: req.body.training.toString(),
        Competencies: req.body.competencies,
        Responsibilities: req.body.responsiblities,
      };
      await dbCommands.addBand(data);
    } else if (req.body.aboveOrBelow === 'bandBelow') {
      const level = await dbCommands.getBandLevel(req.body.refBand);
      const newLevel = Number(level[0].Level) + 1;
      await dbCommands.updateBandLevels(newLevel.toString());
      const data = {
        Name: req.body.name,
        Level: newLevel.toString(),
        Training: req.body.training.toString(),
        Competencies: req.body.competencies,
        Responsibilities: req.body.responsiblities,
      };
      await dbCommands.addBand(data);
    } else { console.log('ERROR PROCESSING'); }
    res.send('New Band Successfully added');
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
    const bandNames = await dbCommands.getBandNames();
    const Names = bandNames.map((element) => element.Name);
    const bandComp = await dbCommands.getCompetencies();
    const Competencies = bandComp.map((element) => element.Competencies);
    const bandTraining = await dbCommands.getTraining();
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

module.exports = router;
