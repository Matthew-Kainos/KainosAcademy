var express = require('express')
var router = express.Router()
const dbCommands = require('../model/dbCommands');
const inputValidator = require('../model/inputValidator');

router.get('/band/:substr', async function (req, res) {
    try{
        var band = req.params.substr;
        const results = await inputValidator.getRolesByBand(dbCommands, band);
        res.send(results);
        res.status(200);
    } catch(e){
        res.status(500);
        res.send('Error');
    }
})

router.get('/band', async function (req, res) {
    try{
        const results = await dbCommands.getAllRolesAndBandDB();
        res.send(results);
        res.status(200);
    } catch(e){
        res.status(500);
        res.send('Error');
    }
})
  
module.exports = router
  