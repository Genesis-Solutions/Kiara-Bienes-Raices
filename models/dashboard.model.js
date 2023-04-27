const db = require('../util/database.js');

module.exports = class Dashboard{

    static fetchAllUsers() {
        return db.execute(
            'SELECT U.idUsuario,U.nombreUsuario,U.apellidosUsuario,R.nombreRol FROM usuario U JOIN rol R ON U.idRol = R.idRol'
        )
    }
    static UpdateUserRol(idUsuario) {
        var idRol=idUsuario[1]
        var idUs=idUsuario[0]
        return db.execute(
            'UPDATE usuario SET idRol=? WHERE idUsuario=?',[idRol, idUs]
        );
    }
    static DeleteUser(idUsuario) {
        return db.execute(
            'DELETE FROM usuario WHERE idUsuario=?',[idUsuario]
        )
    }

}