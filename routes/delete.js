const express = require('express');

const router = express.Router();
const dbCommandsAdmin = require('../model/dbCommandsAdmin');

const DatabaseError = require('../errors/DatabaseError');

router.post('/role', async (req, res) => {
  try {
    const { RoleName } = req.body;
    await dbCommandsAdmin.deleteARole(RoleName);
    res.send({ success: true, message: `${RoleName} Successfully Deleted` });
    res.status(200);
  } catch (e) {
    res.status(500);
    if (e instanceof DatabaseError) {
      res.send('Database Error');
      console.error(e.message);
    }
    res.send('Error');
    console.error(e.message);
  }
});

module.exports = router;
