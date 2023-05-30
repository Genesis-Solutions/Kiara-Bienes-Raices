// Base controlador
const Proceso = require('../models/procesos.model');

exports.getIniciarProceso = async (req, res, next) => {
    res.render('procesosIniciar', {
    isLogged: req.session.isLoggedIn,
    idRol: req.session.idRol,
});
};
