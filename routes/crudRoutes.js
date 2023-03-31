const express = require('express');
const router = express.Router();

const crudController = require('../controllers/crudController');

// Rutas
router.get('/create', crudController.getCreate);
router.post('/create', crudController.postCreate);

router.get('/read', crudController.getRead);

router.get('/update', crudController.getUpdate); 
//router.post('/update', crudController.root);

router.get('/delete', crudController.getDelete); 
//router.post('/delete', crudController.root);

module.exports = router;