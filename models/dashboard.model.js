const db = require('../util/database.js');

module.exports = class Dashboard{

    static fetchAllUsers() {
        return db.execute(
            'SELECT U.idUsuario,U.nombreUsuario,U.apellidosUsuario,R.nombreRol FROM usuario U JOIN rol R ON U.idRol = R.idRol'
        )
    }
    static UpdateUser(idUsuario) {
        var idRol=idUsuario[1]
        var idUs=idUsuario[0]
        console.log("Si llegó")
        return db.execute(
            'UPDATE usuario SET idRol=? WHERE idUsuario=?',[idRol, idUs]
        );
    }

}