const db = require('../util/database.js');
/*
* Historia de usuario 2.7 - Ver lista de inmuebles.
* Modelo que contiene todos las consultas a la base de datos necesarias para el despliegue de la lista de inmuebles.
*/
module.exports = class Dashboard{
    /*
     * Obtener la lista total de usuarios del sistema para la lista.
     * @return JSON -> Lista de usuarios
     */
    static fetchAllUsers() {
        return db.execute(
            'SELECT U.idUsuario,U.nombreUsuario,U.apellidosUsuario,R.nombreRol FROM usuario U JOIN rol R ON U.idRol = R.idRol'
        )
    }
        /*
     * Actualizar rol del usuario en cuestión.
     * @param idUsuario: String -> Concatenación del id del usuario y del rol que este futuramente tendrá
     */
    static UpdateUserRol(idUsuario) {
        //Separación del id en dos variables para ejecutar la query.
        var idRol=idUsuario[1]
        var idUs=idUsuario[0]
        return db.execute(
            'UPDATE usuario SET idRol=? WHERE idUsuario=?',[idRol, idUs]
        );
    }
    /*
     * Borrado del usuario solicitado.
     * @param idUsuario: String -> Id del usuario que será eliminado
     */
    static DeleteUser(idUsuario) {
        return db.execute(
            'DELETE FROM usuario WHERE idUsuario=?',[idUsuario]
        )
    }

}