const dbCommands = require('../model/dbCommands');
var express = require('express')
var router = express.Router()


router.get('/hello', function (req, res) {
    res.status(200);
    res.send('Hello');
})

router.get('/job-roles', async (req, res) => 
{ const dbResults = await dbCommands.getJobRoles(); 
    res.send(dbResults);});
  
module.exports = router
  