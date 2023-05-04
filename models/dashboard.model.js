const db = require('../util/database.js');
const bcrypt = require("bcryptjs");
/*
* Historia de usuario 2.7 - Ver lista de inmuebles.
* Modelo que contiene todos las consultas a la base de datos necesarias para el despliegue de la lista de inmuebles.
*/
module.exports = class Dashboard {
  /*
   * Obtener la lista total de usuarios del sistema para la lista.
   * @return JSON -> Lista de usuarios
   */
  static fetchAllUsers() {
    return db.execute(
      'SELECT U.idUsuario,U.nombreUsuario,U.apellidosUsuario,R.nombreRol FROM usuario U JOIN rol R ON U.idRol = R.idRol WHERE U.activoUsuario=1'
    )
  }
  /*
   * Obtener la lista total de roles del sistema para la lista.
   * @return JSON -> Lista de roles
   */
  static fetchAllRoles() {
    return db.execute(
      'SELECT * FROM rol'
    )
  }
 /*
   * Encontrar un correo de usuario en la base de datos.
   * @param emailUsuario: String -> Correo del usuario que se desea encontrar
   */
  static findOne(emailUsuario) {
    return db.execute("SELECT * FROM usuario WHERE emailUsuario=?", [
      emailUsuario,
    ]);
  }

  /*
* Actualizar rol del usuario en cuestión.
* @param idUsuario: String -> Concatenación del id del usuario y del rol que este futuramente tendrá
*/
  static UpdateUserRol(idUsuario) {
    //Separación del id en dos variables para ejecutar la query.
    var idRol = idUsuario[1]
    var idUs = idUsuario[0]
    return db.execute(
      'UPDATE usuario SET idRol=? WHERE idUsuario=?', [idRol, idUs]
    );
  }
  /*
   * Borrado del usuario solicitado.
   * @param idUsuario: String -> Id del usuario que será eliminado
   */
  static DeleteUser(idUsuario) {
    return db.execute(
      'UPDATE usuario SET activoUsuario=0 WHERE idUsuario=?', [idUsuario]
    )
  }
  /*
   * Revisión de cantidad de inmuebles asignados 
   * @param idUsuario: String -> Id del usuario que será revisado
   */
  static checkUser(idUsuario) {
    return db.execute(
      'SELECT COUNT(idAgenteAsignado) as primera FROM inmueble where activoInmueble=1 AND (idAgenteAsignado=? OR idArrendador=?)', [idUsuario, idUsuario]
    ).then(([rows, fielData]) => {
      return rows[0].primera
    })
  }
  /*
* Revisión de cantidad de trámites de cliente
* @param idUsuario: String -> Id del usuario que será revisado
*/
  static checkUser2(idUsuario) {
    return db.execute(
      'SELECT COUNT(idCliente) as segunda FROM tramite where idCliente=? AND activoTramite=1', [idUsuario]
    ).then(([rows, fielData]) => {
      return rows[0].segunda
    })
  }
  /*
* Revisión de cantidad de trámites de arrendador
* @param idUsuario: String -> Id del usuario que será revisado
*/
  static checkUser3(idUsuario) {
    return db.execute(
      'SELECT COUNT(idArrendador) as tercera FROM tramite where idArrendador=? AND activoTramite=1', [idUsuario]
    ).then(([rows, fielData]) => {
      return rows[0].tercera
    })
  }

   /*
* Registrar un nuevo usuario en el sistema por parte del administrador.
* @param nombreUsuario: String -> Nombre del usuario
* @param apellidosUsuario: String -> Apellidos del usuario
* @param passwordUsuario: String -> Contraseña del usuario
* @param telefonoUsuarioString: String -> Teléfono del usuario
* @param emailUsuario: String -> Correo electrónico del usuario
* @param estadoCivilUsuario: String -> Estado civil del usuario
* @param ocupacionUsuario: String -> Ocupación del usuario
* @param activoUsuarioString: String -> Estado de activo del usuario
* @param idRolString: String -> Id del rol del usuario
* @param idFotoString: String -> Id de la foto del usuario
*/

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
};
