const express = require('express')
const router = express.Router();
const dbCommands = require('../model/dbCommands'); 

router.get('/family/:id', async function (req, res) {
    try{
        const capId = req.params.id;
        const results = await dbCommands.getFamilyBasedOnCapability(capId);
        console.log(results);
        res.send(results);
        res.status(200);
    } catch(e){
        console.log(e);
        res.status(500);
        res.send('Error');
    }
})
  
module.exports = router  