const express = require('express');
const router = express.Router();
const isLogged = require('../util/isLogged.js')
const adminAuth = require('../util/adminAuth.js')

const inmuebleController = require('../controllers/inmueble.controller.js');

//Obtener las imagenes del bucket de S3.
router.get('/get_bucket_img',inmuebleController.getImgFromBucket);
router.get('/:idInmueble', inmuebleController.getInmueble);

//Modificar Inmueble
router.get('/editarInmueble/:idInmueble', isLogged, adminAuth, inmuebleController.getEditarInmueble);

module.exports = router;