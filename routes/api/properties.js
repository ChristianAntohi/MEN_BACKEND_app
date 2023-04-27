const express = require('express');
const router = express.Router();
const propertiesController = require('../../controllers/propertiesController');
const verifyRole = require('../../middleware/verifyRole');

router.route('/')
      // Add a property
      .post(verifyRole([1, 2]), propertiesController.addProperty)

      // Delete a property
      .delete(verifyRole([1, 2]), propertiesController.deleteProperty)
      // Update a property
      .put(verifyRole([1, 2]), propertiesController.updateProperty);

      module.exports = router;