// Base controlador
const Proceso = require('../models/procesos2.model');

exports.getIniciarProceso = async (req, res, next) => {
    res.render('procesosIniciar', {
    isLogged: req.session.isLoggedIn,
    idRol: req.session.idRol,
    idTipoMovimiento: req.params.idTipoMovimiento,
    idInmueble: req.params.idInmueble,
});
};
