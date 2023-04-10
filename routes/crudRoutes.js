const express = require('express');
const router = express.Router();

const crudController = require('../controllers/crudController');

//Create
router.post('/create/text', crudController.postCreateText);
router.post('/create/media',crudController.postCreateMedia);
//router.post('/create/file', crudController.postCreateFile);
router.get('/create', crudController.getCreate);
//Read
router.get('/read/obtener_texto', crudController.getReadText);
router.get('/read/obtener_media', crudController.getReadText);
router.get('/read', crudController.getRead);
//Update
router.put('/update/actualizar_registro/:id', crudController.updateRegisterById);
router.get('/update', crudController.getUpdate);
//Delete
router.delete('/delete/eliminar_registro/:id', crudController.deleteRegisterById);
router.get('/delete', crudController.getDelete);
//Homepage
router.get('/', crudController.getHomepage);

module.exports = router;