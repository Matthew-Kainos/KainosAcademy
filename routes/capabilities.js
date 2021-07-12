const express = require('express')
const router = express.Router();
const dbCommands = require('../model/dbCommands'); 
const DatabaseError = require('../errors/DatabaseError');

router.get('/family/:capName', async function (req, res) {
    try{
        const capName = req.params.capName;
        const results = await dbCommands.getFamilyBasedOnCapability(capName);
        console.log(results);
        res.send(results);
        res.status(200);
    }catch(e){
            res.status(500);
            if(e instanceof DatabaseError) {
                res.send('Database Error');
                console.error(e.message);
            }
            res.send('Error');
            console.error(e.message);
        }
    })

router.get('/findByJobName/:jobName', async function (req, res) {
    try{
        const name = req.params.jobName;
        const results = await dbCommands.getCapabilitiesBasedOnJobName(`%${name}%`);
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

router.get('/checkIfCapabilityExists/:capName', async function (req, res) {
    try{
        const capName = req.params.capName;
        const results = await dbCommands.checkIfCapabilityExists(capName);
        res.status(200);
        if(results.length > 0){
            res.send(JSON.stringify(true));
        } else {
            res.send(JSON.stringify(false));
        }
    } catch(e){
        res.status(500);
        res.send('Error');
    }
}) 

router.get('/getAllFamiliesWithCapability', async function (req, res) {
    try{
        const results = await dbCommands.getAllFamiliesWithCapability();
        res.send(results);
    } catch(e){
        res.status(500);
        res.send('Error');
    }
})

  
module.exports = router  