const express = require("express");
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');

// Rutas
router.get('/lista/usuarios', dashboardController.getUsers);
router.get('/lista', dashboardController.getDashboard);
router.put('/lista/actualizar/:id', dashboardController.updateRol);

module.exports = router;