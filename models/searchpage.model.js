const db = require('../util/database.js');

/*
* Historia de usuario 2.7 - Ver lista de inmuebles.
* Modelo que contiene todos las consultas a la base de datos necesarias para el despliegue de la lista de inmuebles.
*/

module.exports = class SearchPage {

    /*
     * Obtener la cantidad total de inmuebles dentro de la entidad inmueble.
     * @return JSON -> Cantidad total de inmuebles.
     */
    static totalInmuebles() {
        return db.execute(
            'SELECT COUNT(idInmueble) as total FROM inmueble WHERE activoInmueble = 1'
        );
    }

    /*
     * Obtener la cantidad total de inmuebles filtrados dentro de la entidad inmueble.
     * @return JSON -> Cantidad total de inmuebles filtrados.
     */
    static totalInmueblesFiltrados(builtQuery, values) {
        return db.execute(builtQuery, values);
    }

    /*
     * Obtener los inmuebles dependiendo de los limites de la paginación.
     * @param limInferior: String -> Limite inferior (piso) de la paginación.
     * @param limSuperior: String -> Limite superior (techo) de la paginación.
     * @return JSON -> Lista de los inmuebles contenidos dentro de los limites de la busqueda.
     */
    static inmueblesPaginados(limInferior,limSuperior) {
        return db.execute(
            'SELECT * FROM inmueble I JOIN tipo_movimiento TP, categoria C WHERE I.idTipoMovimiento = TP.idTipoMovimiento AND I.idCategoria = C.idCategoria AND I.activoInmueble = 1 LIMIT ?,?',
            [limInferior,limSuperior]
        );
    }

    /*
     * Obtener el id de la foto portada del inmueble (primer registro en la entidad fotoInmueble).
     * @param id: String -> Id de un inmueble. 
     * @return JSON -> Id del primer registro dentro de la entidad fotoInmueble donde este el id del inmueble.
     */
    static idFotoPortada(id) {
        return db.execute(
            'SELECT idFoto FROM fotoInmueble WHERE idInmueble = ? ORDER BY idFoto ASC LIMIT 1',
            [id]
        );
    }

    /*
     * Obtener el nombre del archivo dentro del S3 de la foto portada del inmueble por su id.
     * @param id: String -> Id de una foto. 
     * @return JSON -> Nombre del archivo dentro del S3.
     */
    static srcFotoPortada(id) {
        return db.execute(
            'SELECT archivoFoto FROM foto WHERE idFoto = ?',
            [id]
        );
    }

    /*
     * Obtener los inmuebles que cumplan con las características.
     * @param id: String -> Id de una foto. 
     * @return JSON -> Lista de los inmuebles que cumplan con las características.
     */

    static inmueblesFiltrados(builtQuery, values) {
        return db.execute(builtQuery, values).then(([rows, fieldData]) => {
            return rows;
        })
        .catch((error) => {
            console.log(error);
            return 0;
        });
    };
}