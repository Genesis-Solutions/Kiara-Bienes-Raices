const express = require('express');
const router = express.Router();
const isLogged = require('../util/isLogged.util');
const agenteAdminAuth = require('../util/agenteAdminAuth.util');

const inmuebleController = require('../controllers/inmueble.controller.js');

//Obtener las imagenes del bucket de S3.
router.get('/get_bucket_img',inmuebleController.getImgFromBucket);
router.get('/:idInmueble', inmuebleController.getInmueble);

//Modificar Inmueble
router.get('/editarInmueble/:idInmueble', isLogged, agenteAdminAuth, inmuebleController.getEditarInmueble);
router.post('/editarInmueble/casaDepartamento/:idInmueble', isLogged, agenteAdminAuth, inmuebleController.updateBodyCasa);
router.post('/editarInmueble/local/:idInmueble', isLogged, agenteAdminAuth, inmuebleController.updateBodyLocal);
router.post('/editarInmueble/terreno/:idInmueble', isLogged, agenteAdminAuth, inmuebleController.updateBodyTerreno);
router.post('/editarInmueble/bodega/:idInmueble', isLogged, agenteAdminAuth, inmuebleController.updateBodyBodega);
router.post('/editarInmueble/oficina/:idInmueble', isLogged, agenteAdminAuth, inmuebleController.updateBodyOficina);
router.post('/editarInmueble/otro/:idInmueble', isLogged, agenteAdminAuth, inmuebleController.updateBodyOtra);

module.exports = router;