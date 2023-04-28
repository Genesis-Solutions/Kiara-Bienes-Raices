/*
* Historia de usuario 1.5, 1.6 y 1.9 - Ver lista de usuarios, modificar rol y eliminar usuario.
* Controlador que maneja la lógica tras la llamada de las queriees de la lista de usuarios.
*/
const path = require('path');
const User = require('../models/dashboard.model');
const Dashboard = require('../models/dashboard.model');
const { info } = require('console');
/*
 * Renderización del dashboard tras realizar la validación de rol de usuario.
 */
exports.getDashboard = (req, res, next) => {
    //Revisar que tenga el rol de administrador
    if (req.session.idRol != 1) {
        return res.status(403).send("No tiene autorizado acceder a esta página")
    }
    // Renderizar la vista de registro
    if (req.session.isLoggedIn == true) {
        isLogged = true;
        res.render('listUsers', {
            isLogged: req.session.isLoggedIn,
            idRol: req.session.idRol,
        });
    }
}
/*
 * Llamada de query que actualiza el rol del usuario
 * @param id: String -> Id del usuario que será actualizado
 */
exports.updateRol = async (req, res, next) => {
    const id = req.params.id;
    await Dashboard.UpdateUserRol(id);
}

/*
 * Comprobación de trámites activos del usuario para posteriormente proceder a su eliminación
 * @param id: String -> Id del usuario que será checado y eliminado si es pertinente.
 */
exports.deleteUser = async (req, res, next) => {
    // Triple chequeo de posibles inmuebles, trámite de cliente y trámite de arrendador posibles en el usuario.
    const primeraComprobacion = await Dashboard.checkUser(req.params.id)
    const segundaComprobacion = await Dashboard.checkUser2(req.params.id)
    const terceraComprobacion = await Dashboard.checkUser3(req.params.id)
    tramites_activos = primeraComprobacion + segundaComprobacion + terceraComprobacion
    //Si los trámites activos son 0, eliminar usuario; si esto no es así, regresar un json que avise la existencia de procesos.
    if (tramites_activos == 0) {
        await Dashboard.DeleteUser(req.params.id);
    }
    else {
        res.status(200).json({
            isLogged: req.session.isLoggedIn,
            idRol: req.session.idRol,
            comprobacionEliminado: true
        });
    }

}
/*
 * Llamada de query que regresa un json con los datos de los usuarios del sistema.
 */
exports.getUsers = async (req, res, next) => {
    const dataUsers = await Dashboard.fetchAllUsers();
    res.status(200).json({ code: 200, code: "Ok", data: dataUsers[0] });
}