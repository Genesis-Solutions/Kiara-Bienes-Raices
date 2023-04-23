const express = require('express');
const router = express.Router();

const inmuebleController = require('../controllers/inmueble.controller.js');

router.get('/:idInmueble', inmuebleController.getInmueble);

module.exports = router;