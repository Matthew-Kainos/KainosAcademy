const express = require('express')
const router = express.Router();
const dbCommands = require('../model/dbCommands');


router.get('/', function (req, res) {
    res.status(200);
    res.send('Hello')
})

router.get('/viewCapabilityLead/:capID', async function (req, res){
    try{
        const capID = req.params.capID;
        const results = await dbCommands.getCapabilityLead(capID);
        console.log(results);
        res.send(results);
        res.status(200);
    } catch(e){
        res.status(500);
        res.send('Error');
        console.error(e.message);
    }
})
  
module.exports = router
  