const db = require('../util/database.util');

/*
* Historia de usuario - Iniciar Proceso.
* Modelo que contiene todos las consultas a la base de datos necesarias para el inicio de un proceso.
*/

module.exports = class Procesos2 {
/*
     * Obtener la lista total de clientes del sistema para la lista.
     * @return JSON -> Lista de usuarios
     */
static fetchAllClients() {
    return db.execute(
        'SELECT U.idUsuario,U.nombreUsuario,U.apellidosUsuario,U.emailUsuario,U.telefonoUsuario FROM usuario U WHERE U.activoUsuario=1 AND U.idRol=3'
    ).then(([rows, fielData]) => {
        return rows
    });
}

/*
     * Obtener la información del inmueble seleccionado para el proceso.
     * @return JSON -> Info del inmueble
     */
static fetchInmueble(idInmueble) {
    return db.execute(
        'SELECT I.idInmueble,I.nombreInmueble,I.descInmueble FROM inmueble I WHERE I.IdInmueble=?',[idInmueble]
    ).then(([rows, fielData]) => {
        return rows
    });
}

}