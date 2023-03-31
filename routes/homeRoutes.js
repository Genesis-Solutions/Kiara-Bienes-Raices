const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');

// Rutas
router.get('/', homeController.root); 

module.exports = router;