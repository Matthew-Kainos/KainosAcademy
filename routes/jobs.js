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

router.get('/checkIfJobExists/:jobName', async function (req, res) {
    try{
        const jobName = req.params.jobName;
        const results = await dbCommands.checkIfJobExists(`%${jobName}%`);
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

router.get('/getAllJobsWithCapability', async function (req, res) {
    try{
        const results = await dbCommands.getAllJobsWithCapability();
        res.send(results);
    } catch(e){
        res.status(500);
        res.send('Error');
    }
})

router.get('/job-roles-spec/:roleID', async function (req, res) {
    try{
        const roleID = req.params.roleID;
        const dbResults = await dbCommands.getJobSpec(roleID); 
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
  