const express = require('express');
const router = express.Router();
const isLogged = require('../util/isLogged.util');

const userController = require('../controllers/user.controller.js');
const procesosController = require('../controllers/procesos.controller.js');

/* 
* Obtener las imagenes del bucket de S3.
*/
router.get('/get_bucket_img',userController.getImgFromBucket);
/* 
* Obtener la lista de procesos.
*/
router.get('/procesos', isLogged, procesosController.getProcesos);
/* 
* Ver perfil del usuario.
*/
router.get('/', isLogged, userController.getPerfil);

module.exports = router;