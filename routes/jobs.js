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
  