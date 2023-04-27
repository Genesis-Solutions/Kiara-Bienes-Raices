const express = require("express");
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');

// Rutas
router.post('/modificarRol', dashboardController.updateRol);
router.get('/lista/usuarios', dashboardController.getUsers);
router.get('/lista', dashboardController.getDashboard);
//router.get('/lista/actualizar/:id', dashboardController.updateRol);

module.exports = router;