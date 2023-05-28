const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homepage.controller");
const userController = require("../controllers/user.controller");

// Rutas
/*
*Obtener las imagenes del bucket de S3.
*/
router.get('/get_bucket_img', homeController.getImgFromBucket);
router.get("/", homeController.root);
//router.get('/', homeController.getAltaInmueble);
router.get('/login', userController.getLogin);
router.post('/login', userController.login);
router.get('/logout', userController.logOut);
router.get("/register", userController.getRegister);
router.post("/register", userController.register);
router.get("/contacto", userController.getContacto);
router.get("/politicas", userController.getPoliticas);
router.get('/nosotros', userController.getNosotros);
router.get('/servicios', userController.getServicios);
router.get('/search', homeController.getInmueblesFiltradosIndex);
router.post('/search', homeController.getInmueblesFiltradosIndex);
router.get('/olvidePassword', userController.getOlvidePassword);
router.post('/olvidePassword', userController.resetPassword);
router.get('/olvidePassword/:token', userController.comprobarToken)
//router.post('/olvidePassword/:token', userController)

module.exports = router;