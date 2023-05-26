const db = require("../util/database.util");
const bcrypt = require("bcryptjs");

module.exports = class User {
  constructor(
    nombreUsuario,
    apellidosUsuario,
    passwordUsuario,
    telefonoUsuario,
    emailUsuario,
    estadoCivilUsuario,
    activoUsuario,
    idRol,
    idFoto
  ) {
    this.nombreUsuario = nombreUsuario;
    this.apellidosUsuario = apellidosUsuario;
    this.passwordUsuario = passwordUsuario;
    this.telefonoUsuario = telefonoUsuario;
    this.emailUsuario = emailUsuario;
    this.estadoCivilUsuario = estadoCivilUsuario;
    this.activoUsuario = activoUsuario;
    this.idRol = idRol;
    this.idFoto = idFoto;
  }

  // Para verificar que existe el usuario

  static findOne(emailUsuario) {
    return db.execute("SELECT * FROM usuario WHERE emailUsuario=?", [
      emailUsuario,
    ]);
  }

  static insertUser(
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

  /*
  * Obtener toda la información de un usuario.
  * @param idUsuario: Int -> Id del usuario.
  * @return JSON -> Datos completos del usuario.
  */
  static getUserProfile(idUsuario) {
    return db.execute(
        'SELECT * FROM usuario WHERE idUsuario=?',
        [idUsuario]
    );
  }

};
