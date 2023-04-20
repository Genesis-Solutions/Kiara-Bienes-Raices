const express = require('express');
const router = express.Router();

const searchPageController = require('../controllers/searchpage.controller.js');

router.get('/:pagina',searchPageController.getSearchPage);
router.get('/',searchPageController.getSearchPage);

module.exports = router;