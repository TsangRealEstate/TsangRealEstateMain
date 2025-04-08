const express = require('express');
const router = express.Router();
const { saveLabels, getLabelsByCard } = require('../controllers/labelController');

// Save or update labels
router.post('/', saveLabels);

// Get labels for a specific card
router.get('/:cardId', getLabelsByCard);

module.exports = router;
