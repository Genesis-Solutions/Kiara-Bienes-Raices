const express = require('express');
const router = express.Router();

const testController = require('../controllers/test.controller');

/*
* Rutas de prueba de subida de imagenes al S3 desde EC2.
*/

router.get('/', testController.getTestPage);

module.exports = router;