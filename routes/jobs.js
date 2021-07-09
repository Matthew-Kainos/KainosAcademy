const dbCommands = require('../model/dbCommands');
var express = require('express')
var router = express.Router()

router.get('/hello', function (req, res) {
    res.status(200);
    res.send('Hello');
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
  