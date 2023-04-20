const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class User {

    constructor (nombreUsuario, apellidosUsuario, passwordUsuario, 
        telefonoUsuario, emailUsuario, estadoCivilUsuario, activoUsuario, 
        idRol, idFoto, ocupacionUsuario) {
        this.nombreUsuario = nombreUsuario;
        this.apellidosUsuario = apellidosUsuario;
        this.passwordUsuario = passwordUsuario;
        this.telefonoUsuario = telefonoUsuario;
        this.emailUsuario = emailUsuario;
        this.estadoCivilUsuario = estadoCivilUsuario;
        this.activoUsuario = activoUsuario;
        this.idRol = idRol;
        this.idFoto = idFoto;
        this.ocupacionUsuario = ocupacionUsuario;
    };

    // Para verificar que existe el usuario

    static findOne(emailUsuario) {
        return db.execute('SELECT * FROM usuario WHERE emailUsuario=?', [emailUsuario]);
    }


    static insertUser(nombreUsuario, apellidosUsuario, estadoCivilUsuario, telefonoUsuario, emailUsuario, passwordUsuario, ocupacionUsuario) {
        return db.execute(
            'INSERT INTO usuario (nombreUsuario,apellidoUsuario, estadoCivilUsuario, telefonoUsuario, emailUsuario, passwordUsuario, ocupacionUsuario)VALUES(?, ?, ?, ?, ?, ?, ?)',[nombreUsuario, apellidosUsuario, estadoCivilUsuario, telefonoUsuario, emailUsuario, passwordUsuario, ocupacionUsuario]
        )
    }

}