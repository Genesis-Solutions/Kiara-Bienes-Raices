const express = require('express');
const router = express.Router();

const home_controller = require('../controllers/home_controller');

// Rutas
router.get('/', home_controller.root); 



module.exports = router;