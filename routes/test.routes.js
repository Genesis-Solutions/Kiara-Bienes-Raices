const express = require('express');
const router = express.Router();

const testController = require('../controllers/test.controller');

/*
* Rutas de prueba de subida de imagenes al S3 desde EC2.
*/
//Subir por medio un multer simple a assets/file
router.post('/singleUploadS3',testController.postS3SingleImage);
//Subir por medio un multer simple a assets/file
router.post('/createlocal',testController.postLocalImage);
router.get('/', testController.getTestPage);

module.exports = router;