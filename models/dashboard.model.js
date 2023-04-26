const db = require('../util/database.js');

module.exports = class Dashboard{

    static fetchAllUsers() {
        return db.execute(
            'SELECT U.idUsuario,U.nombreUsuario,U.apellidosUsuario,R.nombreRol FROM usuario U JOIN rol R ON U.idRol = R.idRol'
        )
    }
    static UpdateUser(idUsuario, idRol) {
        return db.execute(
            'UPDATE usuario SET idRol=? WHERE idUsuario=?',[idRol, idUsuario]
        );
    }

}