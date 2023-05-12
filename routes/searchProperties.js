const express = require('express');
const router = express.Router();
const propertiesController = require('../controllers/propertiesController');
      
       //search route for searchProperties controller
router.get('/', propertiesController.searchProperties);

module.exports = router;