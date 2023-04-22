const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class User {

    constructor (nombreUsuario, apellidosUsuario, passwordUsuario, 
        telefonoUsuario, emailUsuario, estadoCivilUsuario, activoUsuario, 
        idRol, idFoto) {
        this.nombreUsuario = nombreUsuario;
        this.apellidosUsuario = apellidosUsuario;
        this.passwordUsuario = passwordUsuario;
        this.telefonoUsuario = telefonoUsuario;
        this.emailUsuario = emailUsuario;
        this.estadoCivilUsuario = estadoCivilUsuario;
        this.activoUsuario = activoUsuario;
        this.idRol = idRol;
        this.idFoto = idFoto;
    };

    // Para verificar que existe el usuario

    static findOne(emailUsuario) {
        return db.execute('SELECT * FROM usuario WHERE emailUsuario=?', [emailUsuario]);
    }
    
}