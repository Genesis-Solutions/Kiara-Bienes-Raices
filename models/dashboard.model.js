const db = require('../util/database.js');

module.exports = class Dashboard{

    static fetchAllUsers() {
        return db.execute(
            'SELECT U.idUsuario,U.nombreUsuario,U.apellidosUsuario,R.nombreRol FROM usuario U JOIN rol R ON U.idRol = R.idRol'
        )
    }
    static UpdateUser(idRol, idUsuario) {
        console.log("id del usuario a cambiar " + idUsuario)
        console.log("id del rol nuevo " + idRol)
        return db.execute(
            'UPDATE usuario SET idRol=? WHERE idUsuario=?',[idRol, idUsuario]
        );
    }

}