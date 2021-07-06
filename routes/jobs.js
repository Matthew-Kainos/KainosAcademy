var express = require('express')
var router = express.Router()
const dbCommands = require('../model/dbCommands');

router.get('/band/:substr', async function (req, res) {
    try{
        var id = parseInt(req.params.substr);
        const results = await dbCommands.getRolesByBand(id);
        res.send(results);
        res.status(200);
    } catch(e){
        res.status(500);
        res.send('Error');
    }
})
  
module.exports = router
  