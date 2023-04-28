const express = require("express");
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');

/*
* Rutas de la lista de usuarios
*/


//Obtener los usuarios activos en el sistema
router.get('/lista/usuarios', dashboardController.getUsers);
//Desplegar dashboard
router.get('/lista', dashboardController.getDashboard);
// Actualizar el rol del usuario escogido
router.put('/lista/actualizar/:id', dashboardController.updateRol);
// Comprobar y eliminar usuario previamente escogido
router.put('/lista/eliminar/:id', dashboardController.deleteUser);
module.exports = router;