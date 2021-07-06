var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {
    res.status(200);
    res.send('Hello')
})

router.get('/viewCapabilityLead', function (req, res){
    try{
        const capID = req.params.id;
        const results = await dbCommands.getCapabilityLeadBasedOnID(capID);
        res.send(results);
        res.status(200);
    } catch(e){
        res.status(500);
        res.send('Error');
    }
})
  
module.exports = router
  