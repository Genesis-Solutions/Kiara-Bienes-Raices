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
     * Obtener la lista total de propiedades del sistema para la lista.
     * @return JSON -> Lista de propiedades
     */
        static fetchAllPropiedades() {
          return db.execute(
              'SELECT I.idInmueble,I.nombreInmueble,U.nombreUsuario as nombresAgente,U.apellidosUsuario as apellidosAgente,X.nombreUsuario as nombresArrendador,X.apellidosUsuario as apellidosArrendador,I.idTipoMovimiento,I.activoInmueble FROM inmueble I JOIN usuario U ON U.idUsuario = I.idAgenteAsignado JOIN usuario X ON X.idUsuario = I.idArrendador'
          )
      }
    
    static findOne(emailUsuario) {
    return db.execute("SELECT * FROM usuario WHERE emailUsuario=?", [
      emailUsuario,
      ]);
    }
    
    /*
 * Actualizar rol del usuario en cuestión.
 * @param idUsuario: String -> Concatenación del id del usuario y del rol que este futuramente tendrá
 */
    static UpdateUserRol(idUsuario,idRol) {
        //Separación del id en dos variables para ejecutar la query.
        return db.execute(
            'UPDATE usuario SET idRol=? WHERE idUsuario=?', [idRol, idUsuario]
        );
    }
    /*
 * Actualizar encargado de la propiedad elegida.
 * @param idAgente: String -> Agente escogido para la propiedad.
 * @param idPropiedad: String -> Propiedad escogida para actualizar su encargado.
 */
    static UpdateEncargadoPropiedad(idAgente, idPropiedad) {
      return db.execute(
          'UPDATE inmueble SET idAgenteAsignado=? WHERE idInmueble=?', [idAgente, idPropiedad]
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
            'SELECT COUNT(idAgenteAsignado) as primera FROM inmueble where idAgenteAsignado=?', [idUsuario]
        ).then(([rows, fielData]) => {
             return rows[0].primera
        })
    }
    /*
 * Revisión de cantidad de trámites de cliente
 * @param idUsuario: String -> Id del usuario que será revisado
 */
    static checkUser2(idUsuario){
        return db.execute(
            'SELECT COUNT(idCliente) as segunda FROM tramite where idCliente=?', [idUsuario]
        ).then(([rows, fielData]) => {
            return rows[0].segunda
        })
    }
    /*
 * Revisión de cantidad de trámites de arrendador
 * @param idUsuario: String -> Id del usuario que será revisado
 */
    static checkUser3(idUsuario){
        return db.execute(
            'SELECT COUNT(idArrendador) as tercera FROM tramite where idArrendador=?', [idUsuario]
        ).then(([rows, fielData]) => {
            return rows[0].tercera
        })
    }
    /*
 * Obtención de agentes disponibles
 */
    static getAgentes(){
      return db.execute(
          'SELECT U.idUsuario, U.nombreUsuario as nombresAgente, U.apellidosUsuario as apellidosAgente FROM usuario U where U.idRol=1 OR U.idRol=2'
      ).then(([rows, fielData]) => {
          return rows
      })
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
};
