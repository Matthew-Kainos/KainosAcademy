const express = require('express');
const router = express.Router();
const dbCommands = require('../model/dbCommands'); 

router.get('/allJobIds', async function (req, res) {
    try{
        const results = await dbCommands.allJobIds();
        res.send(results);
        res.status(200);
    } catch(e){
        res.status(500);
        res.send('Error');
    }
})
  
module.exports = router
  