const express = require('express');
const router = express.Router();

const inmuebleController = require('../controllers/inmueble.controller.js');

//Obtener las imagenes del bucket de S3.
router.get('/get_bucket_img',inmuebleController.getImgFromBucket);
router.get('/:idInmueble', inmuebleController.getInmueble);

module.exports = router;