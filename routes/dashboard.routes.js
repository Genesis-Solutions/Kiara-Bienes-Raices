const express = require("express");
const router = express.Router();
const isLogged = require('../util/isLogged.js')
const adminAuth = require('../util/adminAuth.js')
const agenteAdminAuth = require('../util/agenteAdminAuth.js')

const dashboardController = require('../controllers/dashboard.controller');

// Rutas

router.put('/modificarRol/usuario/:idUsuario', dashboardController.updateRol);
router.put('/lista/actualizar/:id', dashboardController.updateRol);

router.get('/usuarios/nuevoUsuario',isLogged, adminAuth, dashboardController.getAdminUser)
router.post('/usuarios/nuevoUsuario',isLogged, adminAuth, dashboardController.postAdminUser)
router.get('/usuarios',isLogged, adminAuth, dashboardController.getUsers);
router.get('/', isLogged, adminAuth, dashboardController.getDashboard);

module.exports = router;