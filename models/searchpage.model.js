const db = require('../util/database.js');

module.exports = class SearchPage {

    //Obtener la cantidad total de inmuebles dentro de la entidad inmueble
    static totalInmuebles() {
        return db.execute(
            'SELECT COUNT(idInmueble) as total FROM inmueble WHERE activoInmueble = 1'
        );
    }

    //Obtener los inmuebles dependiendo de los limites de la paginación
    static inmueblesPaginados(limInferior,limSuperior) {
        return db.execute(
            'SELECT * FROM inmueble I JOIN tipo_movimiento TP, categoria C WHERE I.idTipoMovimiento = TP.idTipoMovimiento AND I.idCategoria = C.idCategoria AND I.activoInmueble = 1 LIMIT ?,?',
            [limInferior,limSuperior]
        );
    }

    //Obtener el id de la foto portada del inmueble (primer registro en la entidad fotoInmueble)
    static idFotoPortada(id) {
        return db.execute(
            'SELECT idFoto FROM fotoInmueble WHERE idInmueble = ? ORDER BY idFoto ASC LIMIT 1',
            [id]
        );
    }

    //Obtener el id de la foto portada del inmueble (primer registro en la entidad fotoInmueble)
    static srcFotoPortada(id) {
        return db.execute(
            'SELECT archivoFoto FROM foto WHERE idFoto = ?',
            [id]
        );
    }

}