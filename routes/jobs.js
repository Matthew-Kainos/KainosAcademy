const dbCommands = require('../model/dbCommands');
var express = require('express')
var router = express.Router()

router.get('/hello', function (req, res) {
    res.status(200);
    res.send('Hello');
})

router.get('/job-roles-spec/:Role_ID', async(req, res) =>
{   
    const Role_ID = req.params.Role_ID;
    const dbResults = await dbCommands.getJobSpec(Role_ID); res.send(dbResults);
});
  
module.exports = router
  