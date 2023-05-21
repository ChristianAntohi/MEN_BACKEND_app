const express = require('express');
const router = express.Router();
const verifyRole = require('../middleware/verifyRole');
const changePassController = require('../controllers/changePassController');

//route for changing the password for the user logged
router.route('/')
    .post(verifyRole([0, 1, 2]), changePassController);


module.exports = router;