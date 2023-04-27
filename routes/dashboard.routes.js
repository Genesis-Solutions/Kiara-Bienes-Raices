const express = require("express");
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');

// Rutas
router.put('/modificarRol/usuario/:idUsuario', dashboardController.updateRol);
router.get('/lista/usuarios', dashboardController.getUsers);
router.get('/lista', dashboardController.getDashboard);

module.exports = router;