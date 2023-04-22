const express = require('express');
const router = express.Router();

const searchPageController = require('../controllers/searchpage.controller.js');

router.get('/get_bucket_img',searchPageController.getImgFromBucket);
router.get('/:pagina',searchPageController.getSearchPage);
router.get('/',searchPageController.getSearchPage);

module.exports = router;