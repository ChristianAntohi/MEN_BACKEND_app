const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const upload = require('../middleware/upload');

// POST route pentru încărcarea unei proprietăți
router.post('/properties', upload.array('images', 5), propertyController.addProperty);

module.exports = router;