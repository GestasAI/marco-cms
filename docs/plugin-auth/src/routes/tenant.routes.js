const express = require('express');
const TenantController = require('../controllers/TenantController');

const router = express.Router();

// Detectar tenant por subdominio
router.get('/api/tenant/detect', TenantController.detectTenant);

// Listar todos los tenants
router.get('/api/tenants', TenantController.listTenants);

// Buscar tenant por nombre o slug
router.get('/api/tenants/search', TenantController.searchTenant);

module.exports = router;
