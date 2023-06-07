// Base controlador
const Proceso = require('../models/procesos2.model');
const ProcesoInfo = require('../models/procesos.model');
const notificacionPaso = require("../util/email.js");

exports.getIniciarProceso = async (req, res, next) => {
    const inmueble = await Proceso.fetchInmueble(req.params.idInmueble);
    const usuarios = await Proceso.fetchAllClients();
    res.render('procesosIniciar', {
        isLogged: req.session.isLoggedIn,
        idRol: req.session.idRol,
        idAgente: req.session.idUsuario,
        idTipoMovimiento: req.params.idTipoMovimiento,
        inmuebles: inmueble,
        usuarios: usuarios,
        urlFotoUsuario : req.session.urlFotoUsuario
    });
};

/*
 * Inserta un nuevo proceso de seguimiento a un determinado inmueble.
 * @param req La solicitud HTTP que contiene los datos del formulario.
 * @param res La respuesta HTTP que se enviará al navegador.
 * @param next El siguiente middleware en la cadena de middleware.
 * @throws SQLException Si ocurre un error al interactuar con la base de datos.
 */
exports.postIniciarProceso = async(req, res, next) => {
    const idInmueble = req.params.idInmueble;
    const idDuenio = req.body.id_duenio;
    const idCliente = req.body.id_cliente;
    let idAgente = req.session.idUsuario;
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
    const cambiarEstado = await Proceso.changeProcessState(idInmueble);
    const insertarProceso = await Proceso.insertProcess(resultJSON,idInmueble,idCliente,idAgente,idDuenio);
    res.redirect('/perfil/procesos'); //Cambiar despues la redirección
}

/*
 * Actualiza un proceso de seguimiento de un determinado inmueble.
 * @param req La solicitud HTTP que contiene los datos del formulario.
 * @param res La respuesta HTTP que se enviará al navegador.
 * @param next El siguiente middleware en la cadena de middleware.
 * @throws SQLException Si ocurre un error al interactuar con la base de datos.
 */
exports.postModificarProceso = async(req, res, next) => {
    const idTramite = req.params.idTramite;
    const pasos = req.body;
    
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
    console.log("id del tramite", idTramite)
    const actualizarProceso = await Proceso.updateProcess(resultJSON,idTramite);
    const 
    notificacionPaso.notificacionPaso({
        nombre: ,
        email: ,
        idTramite: idTramite,
        nombreInmueble: 
    })
    res.redirect('/perfil/procesos'); //Cambiar despues la redirección
}

/*
 * Muestra la vista detallada de un proceso.
 * @param req La solicitud HTTP que contiene los datos del formulario.
 * @param res La respuesta HTTP que se enviará al navegador.
 * @param next El siguiente middleware en la cadena de middleware.
 * @throws SQLException Si ocurre un error al interactuar con la base de datos.
 */
exports.getTramite = async(req,res,next) => {
    const idTramite = req.params.idTramite;
    const pasos = await ProcesoInfo.getPasos(idTramite);
    const inmueble = await ProcesoInfo.getDescTramite(idTramite);
    res.render('procesosDetallada', {
        isLogged: req.session.isLoggedIn,
        idRol: req.session.idRol,
        idUsuario: req.session.idUsuario,
        inmueble: inmueble[0],
        urlFotoUsuario : req.session.urlFotoUsuario,
        pasos: pasos
    });
};

/*
 * Muestra la la vista detallada del proceso para modificarlo.
 * @param req La solicitud HTTP que contiene los datos del formulario.
 * @param res La respuesta HTTP que se enviará al navegador.
 * @param next El siguiente middleware en la cadena de middleware.
 * @throws SQLException Si ocurre un error al interactuar con la base de datos.
 */
exports.getModificarTramite = async(req,res,next) => {
    const idTramite = req.params.idTramite;
    const pasos = await ProcesoInfo.getPasos(idTramite);
    const inmueble = await ProcesoInfo.getDescTramite(idTramite);
    res.render('procesoModificar', {
        isLogged: req.session.isLoggedIn,
        idRol: req.session.idRol,
        idUsuario: req.session.idUsuario,
        inmueble: inmueble[0],
        urlFotoUsuario : req.session.urlFotoUsuario,
        pasos: pasos,
        idTramite: idTramite
    });
};