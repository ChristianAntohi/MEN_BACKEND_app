const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const verifyRole = require('../../middleware/verifyRole');
const changePassController = require('../../controllers/changePassController');

router.route('/')
//get all users from db
    .get(verifyRole([2]), usersController.getAllUsers)
    //delete user by id
    .delete(verifyRole([2]), usersController.deleteUser)
    //create new user
    .post(verifyRole([2]), usersController.createUser);
    //get user by id
router.route('/:id')
    .get(verifyRole([2]), usersController.getUser)
    // Update an existing user by id
    .put(verifyRole([1, 2]), usersController.updateUser);


module.exports = router;