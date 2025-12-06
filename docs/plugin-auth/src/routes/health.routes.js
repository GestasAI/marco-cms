const express = require('express');
const HealthController = require('../controllers/HealthController');

const router = express.Router();

// Health check
router.get('/health', HealthController.checkHealth);

module.exports = router;
