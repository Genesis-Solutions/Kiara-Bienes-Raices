const express = require("express");
const router = express.Router();
const isLogged = require('../util/isLogged.js')
const adminAuth = require('../util/adminAuth.js')
const agenteAdminAuth = require('../util/agenteAdminAuth.js')

const dashboardController = require('../controllers/dashboard.controller');

// Rutas
router.get('/lista/usuarios', isLogged, adminAuth, dashboardController.getUsers);
router.get('/lista', isLogged, adminAuth, dashboardController.getDashboard);

module.exports = router;