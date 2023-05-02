const express = require("express");
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');

// Rutas
//Registrar imagenes secundarias de una casa
router.post('/alta/inmueble/imagenesSecundarias/:inmueble', dashboardController.setSecondaryPhotos);
//Registrar imagen principal de una casa
router.post('/alta/inmueble/imagenPrincipal/:inmueble', dashboardController.setMainPhoto);
//Actulizar el cuerpo de una casa
router.post('/alta/inmueble/cuerpoCasa/:inmueble', dashboardController.updateBodyCasa);

//Actualizar el cuerpo de un departamento
router.post('/alta/inmueble/cuerpoDepartamento/:inmueble', dashboardController.updateBodyCasa);
//Actualizar el cuerpo de una bodega
router.post('/alta/inmueble/cuerpoBodega/:inmueble', dashboardController.updateBodyBodega);
//Actualizar el cuerpo de un terreno
router.post('/alta/inmueble/cuerpoTerreno/:inmueble', dashboardController.updateBodyTerreno);
//Actualizar el cuerpo de un local
router.post('/alta/inmueble/cuerpoLocal/:inmueble', dashboardController.updateBodyLocal);
//Actualizar el cuerpo de un oficina
router.post('/alta/inmueble/cuerpoOficina/:inmueble', dashboardController.updateBodyOficina);
//Actualizar el cuerpo de un otro
router.post('/alta/inmueble/cuerpoOtro/:inmueble', dashboardController.updateBodyOtro);
//Poner el resto de inmuebles....

//Ver el formulario dependiendo de la categoria
router.get('/alta/inmueble/:categoria', dashboardController.getCategoria);
//Ver menu de inmuebles
router.get('/alta', dashboardController.getRegisterpage);
//Obtener lista de usuarios
router.get('/lista/usuarios', dashboardController.getUsers);
//Render de la pagina de la lista de usuarios
router.get('/lista', dashboardController.getDashboard);

module.exports = router;