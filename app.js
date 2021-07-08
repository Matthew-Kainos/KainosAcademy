const express = require('express');
const app = express();
const jobs  = require('./routes/jobs');
const capabilities  = require('./routes/capabilities')
const bands  = require('./routes/bands')

app.use(express.json());
app.use(express.urlencoded());
const dbCommands = require('./model/dbCommands');

app.use('/jobs', jobs);
app.use('/capabilities', capabilities);
app.use('/bands', bands);

app.get('/job-roles-spec/:Role_ID', function (req, res){
    res.send('On job roles spec page')
})

// 404 Path 
app.use((req, res) => {
    res.status(404).json({
        message: `Unable to find path ${req.path}`
    })
})

app.listen(3000, function() { 
    console.log('Express started') 
 });

 module.exports = app;