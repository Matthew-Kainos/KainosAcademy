var express = require('express')
var router = express.Router()
const dbCommands = require('../model/dbCommands');

router.get('/band/:substr', async function (req, res) {
    try{
        var band = req.params.substr;
        const results = await getRolesByBand(dbCommands, band);
        res.send(results);
        res.status(200);
    } catch(e){
        res.status(500);
        res.send('Error');
    }
})

router.get('/band', async function (req, res) {
    try{
        const results = await dbCommands.getAllRolesAndBandDB();
        res.send(results);
        res.status(200);
    } catch(e){
        res.status(500);
        res.send('Error');
    }
})

getRolesByBand = async (dbContext, band) => {
    try{
        const Role = band.replace('_', ' ');
        if(!/^[a-zA-Z\s]*$/.test(Role)) { return 'Error: Invalid input'; }
        const results = await dbContext.getRoleAndBandDB(Role);
        return results;
    } catch(e){
        console.log(e);
        res.status(500);
        res.send('Error');
    }
}
  
module.exports = router
  