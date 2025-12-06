const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

// Login
router.post('/api/login', AuthController.login);

// Obtener usuario actual
router.get('/api/me', AuthController.getCurrentUser);

// Logout
router.post('/api/logout', AuthController.logout);

module.exports = router;
