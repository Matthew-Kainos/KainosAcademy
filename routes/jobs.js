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

router.get('/checkIfJobExists/:jobID', async function (req, res) {
    try{
        const jobID = req.params.jobID;
        const results = await dbCommands.checkIfJobIdExists(jobID);
        res.status(200);
        if(results.length > 0){
            res.send(JSON.stringify(true));
        } else {
            res.send(JSON.stringify(false));
        }

    } catch(e){
        res.status(500);
        res.send('Error');
    }
})

router.get('/job-roles-spec/:Role_ID', async function (req, res) {
    try{
        const Role_ID = req.params.Role_ID;
        const dbResults = await dbCommands.getJobSpec(Role_ID); 
        res.send(dbResults);
        res.status(200);
    } catch(e){
        res.status(500);
        if(e instanceof DatabaseError) {
            res.send('Database Error');
            console.error(e.message);
        }
        res.send('Error');
        console.error(e.message);
    }
})


  
module.exports = router
  