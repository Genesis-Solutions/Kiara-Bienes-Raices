// Base controlador
const Proceso = require('../models/procesos2.model');
const ProcesoInfo = require('../models/procesos.model');
const {notificacionPaso, cancelacionTramite} = require("../util/email.js");

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
    const nombreInmueble = req.body.nombreInmueble;
    var nombreIn = "nombreInmueble";
    const pasos = req.body;
    delete pasos[nombreIn];
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
    const actualizarProceso = await Proceso.updateProcess(resultJSON,idTramite);
    const infoTramite = await ProcesoInfo.getInfoTramite(idTramite);
    const infoDuenio = await ProcesoInfo.getInfoUsuario(infoTramite[0][0].idArrendador)
    const infoCliente = await ProcesoInfo.getInfoUsuario(infoTramite[0][0].idCliente)
    notificacionPaso.notificacionPaso({
        nombre: infoDuenio[0][0].nombreUsuario,
        email: infoDuenio[0][0].emailUsuario,
        idTramite: idTramite,
        nombreInmueble: nombreInmueble
    })
    notificacionPaso.notificacionPaso({
        nombre: infoCliente[0][0].nombreUsuario,
        email: infoCliente[0][0].emailUsuario,
        idTramite: idTramite,
        nombreInmueble: nombreInmueble
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

/*
Elimina un inmueble del dashboard por su ID.
@param {Object} req - Objeto de solicitud de Express con el parámetro "idInmueble".
@param {Object} res - Objeto de respuesta de Express.
@param {Function} next - Función de middleware para pasar el control al siguiente manejador.
@returns {Object} - Objeto JSON con el código de estado 200 y mensaje "Ok" si la operación fue exitosa.
@throws {Error} - Error de base de datos si no se puede eliminar el inmueble.
*/
exports.cancelarProceso = async (req, res, next) => {
    const idInmueble = req.params.idInmueble;
    const idTramite = req.params.idTramite;
    const infoTramite = await ProcesoInfo.getInfoTramite(idTramite);
    const infoCliente = await ProcesoInfo.getInfoUsuario(infoTramite[0][0].idCliente);
    const nombreInmueble = await Proceso.fetchInmueble(idInmueble);
    ProcesoInfo.deactivateProcess(idTramite)
        .then(([rows, fieldData]) => {
            ProcesoInfo.activateInmueble(idInmueble)
                .then(([rows, fieldData]) => {
                    cancelacionTramite.cancelacionTramite({
                        nombre: infoCliente[0][0].nombreUsuario,
                        email: infoCliente[0][0].emailUsuario,
                        nombreInmueble: nombreInmueble[0].nombreInmueble
                    })
                    res.status(200).json({ code: 200, msg: "Ok" });
                })
                .catch(error => { console.log(error) });
                })
        .catch(error => { console.log(error) });
};