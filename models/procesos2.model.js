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

    /*
    *Inserta un nuevo proceso de trámite en la base de datos.
    *@param arregloPasos el arreglo de pasos del trámite
    *@param idInmueble el ID del inmueble relacionado al trámite
    *@param idCliente el ID del cliente relacionado al trámite
    *@param idAgente el ID del agente relacionado al trámite
    *@param idArrendador el ID del arrendador relacionado al trámite
    *@return el resultado de la ejecución del comando INSERT en la base de datos
    */
    static insertProcess(arregloPasos,idInmueble,idCliente,idAgente,idArrendador) {
        return db.execute(
            'INSERT INTO tramite(fechaCreacionTramite, activoTramite, arregloPasos, idInmueble, idCliente, idAgente, idArrendador) VALUES(CURRENT_TIMESTAMP(),1,?,?,?,?,?)',
            [arregloPasos,idInmueble,idCliente,idAgente,idArrendador]
        )
    }
}