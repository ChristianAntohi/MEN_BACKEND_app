const express = require('express')
const router = express.Router()
const usersController = require('../../controllers/usersController')
const verifyRole = require('../../middleware/verifyRole')

router.route('/')
// get all users from db
  .get(verifyRole([2]), usersController.getAllUsers)
// delete user by id
  .delete(verifyRole([0, 1, 2]), usersController.deleteUser)
// Update an existing user by id
  .post(verifyRole([0, 1, 2]), usersController.updateUser)
// get user by id
router.route('/:id')
  .get(verifyRole([2]), usersController.getUser)

module.exports = router
