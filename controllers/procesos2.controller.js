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
    const idDuenio = req.body.id_duenio;
    const idCliente = req.body.id_cliente;
    const pasos = req.body;
    var duenio = "id_duenio";
    var cliente = "id_cliente";
    delete pasos[duenio];
    delete pasos[cliente];
    const splitKeyValue = obj => {
        const keys = Object.keys(obj);
        const result = [];
        for(let i = 0; i < keys.length; i=i+5){
        result.push({
            'titulo': obj[keys[i]],
            'descPaso': obj[keys[i+1]],
            'paso':obj[keys[i+2]],
            'status':obj[keys[i+3]],
            'observacion':obj[keys[i+4]],
        });
        };
        return result;
    };
    const result = splitKeyValue(pasos);
    const resultJSON = JSON.stringify(result);
    console.log(resultJSON);
}