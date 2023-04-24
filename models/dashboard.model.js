const db = require('../util/database.js');

module.exports = class Dashboard{

    static fetchAllUsers() {
        return db.execute(
            'SELECT usuario.nombreUsuario, usuario.apellidosUsuario, rol.nombreRol AS nombreRol FROM usuario JOIN rol ON usuario.idRol = rol.idRol WHERE usuario.idUsuario'
        )
    }

}