const express = require('express');
const router = express.Router();
const dbCommands = require('../model/dbCommands'); 

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
  
module.exports = router
  