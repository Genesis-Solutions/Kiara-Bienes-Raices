const express = require("express");
const router = express.Router();
const isLogged = require('../util/isLogged.js')
const adminAuth = require('../util/adminAuth.js')
const agenteAdminAuth = require('../util/agenteAdminAuth.js')

const dashboardController = require('../controllers/dashboard.controller');


/*
* Rutas de la lista de usuarios
*/
// Actualizar el rol del usuario escogido
router.put('/lista/actualizar/:id', dashboardController.updateRol);
// Comprobar y eliminar usuario previamente escogido
router.put('/lista/eliminar/:id', dashboardController.deleteUser);

router.get('/propiedades',isLogged, agenteAdminAuth, dashboardController.getPropiedades)
router.get('/usuarios/nuevoUsuario',isLogged, adminAuth, dashboardController.getAdminUser)
router.post('/usuarios/nuevoUsuario',isLogged, adminAuth, dashboardController.postAdminUser)
router.get('/usuarios',isLogged, adminAuth, dashboardController.getUsers);
router.get('/', isLogged, agenteAdminAuth, dashboardController.getDashboard);


module.exports = router;