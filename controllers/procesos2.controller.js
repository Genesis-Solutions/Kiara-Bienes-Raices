// Base controlador
const Proceso = require('../models/procesos2.model');

exports.getIniciarProceso = async (req, res, next) => {
    const inmueble = await Proceso.fetchInmueble(req.params.idInmueble);
    const usuarios = await Proceso.fetchAllClients();
    res.render('procesosIniciar', {
        isLogged: req.session.isLoggedIn,
        idRol: req.session.idRol,
        idAgente: req.session.idUsuario,
        idTipoMovimiento: req.params.idTipoMovimiento,
        inmuebles: inmueble,
        usuarios: usuarios
    });
};

exports.postIniciarProceso = async(req, res, next) => {
    const idInmueble = req.params.idInmueble;
    console.log(idInmueble);
    console.log(req.body);
    

}
