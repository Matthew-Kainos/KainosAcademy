var express = require('express')
var router = express.Router()
const dbCommands = require('../model/dbCommands');
const DatabaseError = require('../errors/DatabaseError'); 


router.get('/hello', function (req, res) {
    res.status(200);
    res.send('Hello');
})


router.get('/job-roles', async (req, res) => {
    try {
         const dbResults = await dbCommands.getJobRoles(); 
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
  