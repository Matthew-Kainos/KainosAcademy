const express = require('express');
const router = express.Router();
const dbCommands = require('../model/dbCommands'); 
const DatabaseError = require('../errors/DatabaseError'); 

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


router.get('/job-roles', async (req, res) => {
    try {
         const dbResults = await dbCommands.getJobRoles(); 
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
  