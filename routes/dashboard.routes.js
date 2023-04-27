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
// Eliminar usuario previamente escogido
router.put('/lista/eliminar/:id', dashboardController.deleteUser);
// Asegurar que el usuario previamente escogido no tiene procesos pendientes
router.get('/lista/eliminar/asegurar/:id', dashboardController.checkUser);
module.exports = router;