const express = require('express');
const router = express.Router();
const propertiesController = require('../../controllers/propertiesController');
const verifyRole = require('../../middleware/verifyRole');

router.route('/')
      // Add a property
      .post(verifyRole([1, 2]), propertiesController.addProperty)
      //Get all properties from database with imageURLs stored in image field for every user on UI
      .get(propertiesController.getAllProperties)
      // Delete a property
      .delete(verifyRole([1, 2]), propertiesController.deleteProperty)
      // Update a property
      .put(verifyRole([1, 2]), propertiesController.updateProperty);
router.route('/:id')
      .get(propertiesController.getPropertybyId);

      //search route for searchProperties controller
router.get('/search', propertiesController.searchProperties);

      module.exports = router;