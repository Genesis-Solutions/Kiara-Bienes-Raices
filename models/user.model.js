const db = require("../util/database");
const bcrypt = require("bcryptjs");

module.exports = class User {
  // Para verificar que existe el usuario

  static findOne(emailUsuario) {
    return db.execute("SELECT * FROM usuario WHERE emailUsuario=?", [
      emailUsuario,
    ]);
  }

    static insertUser(nombreUsuario, apellidosUsuario,passwordUsuario,telefonoUsuarioString, emailUsuario,estadoCivilUsuario, ocupacionUsuario,activoUsuarioString ,idRolString, idFotoString) {
    return bcrypt.hash(passwordUsuario, 12)
        .then((passwordCifrado)=> {
            return db.execute('INSERT INTO usuario(nombreUsuario, apellidosUsuario,passwordUsuario,telefonoUsuario, emailUsuario,estadoCivilUsuario, ocupacionUsuario,activoUsuario ,idRol, idFoto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
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
              ]).catch((error)=>{
                console.log(error);
            });
        })
}
};
