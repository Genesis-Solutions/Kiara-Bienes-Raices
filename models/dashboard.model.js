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
            'UPDATE usuario SET activoUsuario=0 WHERE idUsuario=?',[idUsuario]
        )
    }
        /*
     * Chequeo de trámites de usuario
     * @param idUsuario: String -> Id del usuario que será revisado
     */
        static checkUser(idUsuario) {
            //Revisión del agente
            var count_1= db.execute(
                'SELECT COUNT(idAgenteAsignado) FROM inmueble where idAgenteAsignado=?',[idUsuario]
            )
            //Revisión del cliente
            var count_2= db.execute(
                'SELECT COUNT(idCliente) FROM tramite where idCliente=?',[idUsuario]
            )
            //Revisión del arrendador
            var count_3= db.execute(
                'SELECT COUNT(idArrendador) FROM tramite where idArrendador=?',[idUsuario]
            )
            count_1=count_1.COUNT(idAgenteAsignado)
            count_2=count_2.COUNT(idAgenteAsignado)
            count_3=count_3.COUNT(idAgenteAsignado)        
            return count_1+count_2+count_3
        }

}