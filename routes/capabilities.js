const express = require('express')
const router = express.Router();
const dbCommands = require('../model/dbCommands'); 

router.get('/findByJobId/:id', async function (req, res) {
    try{
        const jobId = req.params.id;
        const results = await dbCommands.getCapabilitiesBasedOnJobId(jobId);
        res.send(results);
        res.status(200);
    } catch(e){
        res.status(500);
        res.send('Error');
    }
})
  
module.exports = router
  