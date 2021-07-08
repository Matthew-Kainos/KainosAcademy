const express = require('express')
const router = express.Router();
const dbCommands = require('../model/dbCommands'); 
const DatabaseError = require('../errors/DatabaseError');

router.get('/family/:id', async function (req, res) {
    try{
        const capId = req.params.id;
        const results = await dbCommands.getFamilyBasedOnCapability(capId);
        console.log(results);
        res.send(results);
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