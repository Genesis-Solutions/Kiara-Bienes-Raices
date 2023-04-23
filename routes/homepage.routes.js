const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homepage.controller');
const inmuebleController = require('../controllers/inmueble.controller');

// Rutas
router.get('/', homeController.root);

module.exports = router;