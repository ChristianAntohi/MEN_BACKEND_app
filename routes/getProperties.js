const express = require('express');
const router = express.Router();
const propertiesController = require('../controllers/propertiesController');


router.route('/')
    //Get all properties from database with imageURLs stored in image field for every user on UI
    .get(propertiesController.getAllProperties);
router.route('/:id')
    .get(propertiesController.getPropertybyId)

module.exports = router;