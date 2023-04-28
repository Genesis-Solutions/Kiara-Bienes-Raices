const express = require('express');
const router = express.Router();

const searchPageController = require('../controllers/searchpage.controller.js');

/*
* Rutas del catalogo de inmuebles.
*/

//Obtener las imagenes del bucket de S3.
router.get('/get_bucket_img',searchPageController.getImgFromBucket);
//Desplegar catalogo y obtener query(?pagina=) de paginación.
router.get('/',searchPageController.getSearchPage);
router.post('/search', searchPageController.getInmueblesFiltrados);

module.exports = router;