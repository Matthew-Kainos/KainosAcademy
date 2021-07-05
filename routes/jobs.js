var express = require('express')
var router = express.Router()


router.get('/hello', function (req, res) {
    res.status(200);
    res.send('Hello');
})
  
module.exports = router
  