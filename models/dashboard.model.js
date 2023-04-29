const db = require('../util/database.js');
const bcrypt = require("bcryptjs");

module.exports = class Dashboard {

    static fetchAllUsers() {
        return db.execute(
            'SELECT U.idUsuario,U.nombreUsuario,U.apellidosUsuario,R.nombreRol FROM usuario U JOIN rol R ON U.idRol = R.idRol'
        )
    }
    static UpdateUser(idUsuario) {
        var idRol=idUsuario[1]
        var idUs=idUsuario[0]
        return db.execute(
            'UPDATE usuario SET idRol=? WHERE idUsuario=?',[idRol, idUs]
        );
    }

    static findOne(emailUsuario) {
        return db.execute("SELECT * FROM usuario WHERE emailUsuario=?", [
            emailUsuario,
        ]);
    }

    static adminInsertUser(
        nombreUsuario,
        apellidosUsuario,
        passwordUsuario,
        telefonoUsuarioString,
        emailUsuario,
        estadoCivilUsuario,
        ocupacionUsuario,
        activoUsuarioString,
        idRolString,
        idFotoString
    ) {
        return bcrypt.hash(passwordUsuario, 12).then((passwordCifrado) => {
            return db
                .execute(
                    "INSERT INTO usuario(nombreUsuario, apellidosUsuario,passwordUsuario,telefonoUsuario, emailUsuario,estadoCivilUsuario, ocupacionUsuario,activoUsuario ,idRol, idFoto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        nombreUsuario,
                        apellidosUsuario,
                        passwordCifrado,
                        telefonoUsuarioString,
                        emailUsuario,
                        estadoCivilUsuario,
                        ocupacionUsuario,
                        activoUsuarioString,
                        idRolString,
                        idFotoString,
                    ]
                )
                .catch((error) => {
                    console.log(error);
                });
        });
    }


}