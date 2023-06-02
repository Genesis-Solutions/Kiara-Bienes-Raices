const db = require("../util/database.util");
const bcrypt = require("bcryptjs");

class User {
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
  
    /*
    * Obtener el nombre del archivo dentro del S3 de la foto portada del inmueble por su id.
    * @param id: String -> Id de una foto. 
    * @return JSON -> Nombre del archivo dentro del S3.
    */
    static srcFotoPortada(id) {
        return db.execute(
          'SELECT archivoFoto FROM foto WHERE idFoto = ?',
          [id]
        );
    }

  /*
  * Obtener nombre del usuario mediante email.
  * @param emailUsuario: String -> email del usuario.
  * @return JSON -> Nombre del usuario.
  */
  static getUserName(emailUsuario) {
    return db.execute(
        'SELECT nombreUsuario FROM usuario WHERE emailUsuario=?',
        [emailUsuario]
    ).then(([rows, fielData]) => {
      return rows[0].nombreUsuario;
    }).catch((error) => {
        console.log(error);
        return 0;
    });
  }

  /**
   * Nueva contraseña
   */

  static resetPassword(newPassword, emailUsuario){
    return bcrypt.hash(newPassword, 12).then((passwordCifrado) => {
        return db.execute('UPDATE usuario SET passwordUsuario = ? WHERE emailUsuario = ?', [passwordCifrado, emailUsuario])
    }).catch((error)=>{
        console.log(error);
    });
}

    /*
    Registra la imagen de un inmueble en la base de datos.
    @param {string} photoKey - La clave de la imagen que se guardará en Amazon S3.
    @returns {Promise} Promesa que devuelve el resultado de la consulta a la base de datos.
    */
    static registerPFP(photoKey,idUsuario){
      const fullImage = "s3://kiarabienesraices/"+photoKey;
      return db.execute(
          'CALL newPFP (?,?)',
          [fullImage,idUsuario]
      );
  }

    /*
    Actualiza la información del usuario en la base de datos.
    @param nombre el nombre del usuario
    @param apellidos los apellidos del usuario
    @param email el correo electrónico del usuario
    @param telefono el número de teléfono del usuario
    @param estadoCivilUsuario el estado civil del usuario
    @param ocupacionUsuario la ocupación del usuario
    @param idUsuario el ID del usuario a actualizar
    @return el resultado de la ejecución del comando UPDATE en la base de datos
    */
    static changeUserInfo(nombre,apellidos,email,telefono,estadoCivilUsuario,ocupacionUsuario,idUsuario){
      return db.execute(
          'UPDATE usuario SET nombreUsuario=?, apellidosUsuario=?, emailUsuario=?, telefonoUsuario=?, estadoCivilUsuario=?, ocupacionUsuario=? WHERE idUsuario=?',
          [nombre,apellidos,email,telefono,estadoCivilUsuario,ocupacionUsuario,idUsuario]
      );
  }

};

class Token {
  /*
   * 
   * @param {*} email 
   * @param {*} token 
   * @param {*} fechaIntento 
   */

  constructor(email,token,fechaIntento) {
      this.email = email, this.token = token, this.fechaIntento};

  static insertToken(email, token, fechaIntento) {
      return db.execute('INSERT INTO token (email, token, fechaIntento) VALUES (?,?,?)', 
      [email, token, fechaIntento]).catch((error) => {
      console.log(error);
      });
  };

  static findOne(token) {
    return db.execute("SELECT * FROM token WHERE token = ?", [token])
    .then(([rows, fieldData]) => {
      return rows;
    })
    .catch((error) => {
      console.log(error);
      return 0;
    });
  };

  static deleteToken(token) {
    return db.execute('DELETE FROM token WHERE token = ?', [token])
  }
};

module.exports = {User, Token};