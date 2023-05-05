const express = require("express");
const router = express.Router();

const isLogged = require('../util/isLogged.util');
const adminAuth = require('../util/adminAuth.util');
const agenteAdminAuth = require('../util/agenteAdminAuth.util');

const dashboardController = require('../controllers/dashboard.controller');

// Rutas
//Registrar imagenes de un inmueble
router.post('/alta/inmueble/imagenes/:inmueble', dashboardController.setPhotos);
//Actulizar el cuerpo de una casa
router.post('/alta/inmueble/cuerpoCasa/:inmueble', dashboardController.updateBodyCasa);
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
//Eliminar inmueble por su id
router.get('/baja/inmueble/:idInmueble', dashboardController.deleteInmueble);
//Ver el formulario dependiendo de la categoria
router.get('/alta/inmueble/:categoria', dashboardController.getCategoria);
//Ver menu de inmuebles
router.get('/alta', dashboardController.getRegisterpage);
/*
* Rutas de la lista de usuarios
*/
// Actualizar el rol del usuario escogido
router.put('/lista/actualizar/:idUsuario/:idRol', dashboardController.updateRol);
// Comprobar y eliminar usuario previamente escogido
router.put('/lista/eliminar/:id', dashboardController.deleteUser);
// Actualizar el encargado de una determinada propiedad
router.put('/props/actualizar/:idAgente/:idPropiedad', dashboardController.updateEncargado);

router.get('/propiedades',isLogged, agenteAdminAuth, dashboardController.getPropiedades)
router.get('/usuarios/nuevoUsuario',isLogged, adminAuth, dashboardController.getAdminUser)
router.post('/usuarios/nuevoUsuario',isLogged, adminAuth, dashboardController.postAdminUser)
router.get('/usuarios',isLogged, adminAuth, dashboardController.getUsers);
router.get('/', isLogged, agenteAdminAuth, dashboardController.getDashboard);
router.get('/props', isLogged, agenteAdminAuth, dashboardController.getDashboardProps);
router.get('/agentes', isLogged, agenteAdminAuth, dashboardController.getAgentes);

module.exports = router;