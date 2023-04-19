const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homepage.controller');
const userController = require('../controllers/user.controller');

// Rutas
router.get('/', homeController.root); 
router.get('/login', userController.get_login);
router.post('/login', userController.login);


module.exports = router;