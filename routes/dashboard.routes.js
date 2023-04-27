const express = require("express");
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');

// Rutas
//Registrar imagen principal de una casa
router.post('/alta/inmueble/imagenPrincipal/:inmueble', dashboardController.setMainPhoto);
//Actulizar el cuerpo de una casa
router.post('/alta/inmueble/cuerpoCasa/:inmueble', dashboardController.updateBodyCasa);
//Ver el formulario dependiendo de la categoria
router.get('/alta/inmueble/:categoria', dashboardController.getCategoria);
//Ver menu de inmuebles
router.get('/alta', dashboardController.getRegisterpage);
//Obtener lista de usuarios
router.get('/lista/usuarios', dashboardController.getUsers);
//Render de la pagina de la lista de usuarios
router.get('/lista', dashboardController.getDashboard);

module.exports = router;