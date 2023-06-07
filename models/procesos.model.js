const db = require('../util/database.util');

/**
 * Clase que representa los procesos relacionados con los trámites.
 */
module.exports = class Procesos {

    /*
     * Constructor de la clase Procesos.
     * @param {number} idTramite - El ID del trámite.
     * @param {Date} fechaCreacionTramite - La fecha de creación del trámite.
     * @param {boolean} activoTramite - Indicador de activo/inactivo del trámite.
     * @param {number} idInmueble - El ID del inmueble asociado al trámite.
     * @param {number} idCliente - El ID del cliente asociado al trámite.
     * @param {number} idAgente - El ID del agente asociado al trámite.
     * @param {number} idArrendador - El ID del arrendador asociado al trámite.
     */
    constructor(
        idTramite,
        fechaCreacionTramite,
        activoTramite,
        idInmueble,
        IdCliente,
        IdAgente,
        IdArrendador
    ) {
        this.idTramite = idTramite
        this.fechaCreacionTramite = fechaCreacionTramite
        this.activoTramite = activoTramite
        this.idInmueble = idInmueble
        this.IdCliente = IdCliente
        this.IdAgente = IdAgente
        this.IdArrendador = IdArrendador
    }

      /**
     * Obtiene la información del agente a partir del ID del inmueble.
     * @param {number} idInmueble - El ID del inmueble.
     * @returns {Promise} Una promesa que se resuelve con la información del agente.
     */

    static getAgentInfo(idInmueble) {
        return db.execute(
          "SELECT u.idUsuario, u.nombreUsuario, u.telefonoUsuario, u.emailUsuario FROM usuario u JOIN tramite t ON u.idUsuario = t.idAgente WHERE t.idTramite = (SELECT idTramite FROM tramite WHERE idInmueble=?)",
          [idInmueble]
        );
  }

  /**
 * Obtiene el nombre y ID del agente asociado a un trámite.
 * @param {number} idTramite - El ID del trámite.
 * @returns {Promise} Una promesa que se resuelve con el nombre y ID del agente.
 */
  
  static getNombreAgente(idTramite) {
    return db.execute(
      "SELECT u.idUsuario, u.nombreUsuario, u.apellidosUsuario FROM usuario u JOIN tramite t ON u.idUsuario = t.idAgente WHERE t.idTramite = ?",
      [idTramite]
    );
  }

  static getFotoAgente(idUsuario) {
    return db.execute(
      "SELECT u.idUsuario, u.idFoto, f.archivoFoto FROM usuario u JOIN foto f ON u.idFoto = f.idFoto WHERE u.idUsuario = ?",
      [idUsuario]
    );
  }
  

  /**
 * Obtiene la foto asociada a un inmueble.
 * @param {number} idInmueble - El ID del inmueble.
 * @returns {Promise} Una promesa que se resuelve con la foto del inmueble.
 */
  static getFotoTramite(idInmueble) {
    return db.execute(
      "SELECT idFoto FROM fotoinmueble WHERE idInmueble = ?",
      [idInmueble]
    );
}

      /**
     * Obtiene la información del inmueble asociado al trámite del agente.
     * @param {number} idAgente - El ID del agente.
     * @returns {Promise} Una promesa que se resuelve con la información del inmueble.
     */
    
    static getInfoInmuebleTramiteAgente(idAgente) {
        return db.execute(
          "SELECT I.idInmueble, I.nombreInmueble, I.descInmueble, I.direccionInmueble FROM inmueble I JOIN tramite TR ON I.idInmueble = TR.idInmueble WHERE TR.idAgente = ?",
          [idAgente]
        );
      }

      /**
     * Obtiene la información del inmueble asociado al trámite del usuario.
     * @param {number} idUsuario - El ID del usuario.
     * @returns {Promise} Una promesa que se resuelve con la información del inmueble.
     */
  static getDescTramite(idTramite) {
      
    return db
    .execute("SELECT I.idInmueble, I.nombreInmueble, I.descInmueble, I.direccionInmueble FROM inmueble I JOIN tramite TR ON I.idInmueble = TR.idInmueble WHERE TR.idTramite = ?", [idTramite])
    .then(([rows, data]) => {
      //console.log(rows)
      return rows;
    })
    .catch((error) => {
      console.log(error);
      return 0;
    });
  }
  
    /*
     * Obtener los tramites de un usuario
     * @return JSON -> Cantidad total de inmuebles.
     */
  static infoTramite(idUsuario) {
      
    return db
      .execute("SELECT * FROM tramite WHERE idCliente = ? OR idArrendador = ? OR idAgente = ? AND activoTramite = 1", [idUsuario, idUsuario, idUsuario])
      .then(([rows, data]) => {
        //console.log(rows)
        return rows;
      })
      .catch((error) => {
        console.log(error);
        return 0;
      });
  }

  static getTramite(idTramite) {
    return db
      .execute("SELECT * FROM tramite WHERE idTramite = ? AND activoTramite = 1", [idTramite])
      .then(([rows, data]) => {
        return rows[0];
      })
      .catch((error) => {
        console.log(error);
        return 0;
      });
  }

  static getPasos(idTramite) {
    return db
      .execute("SELECT arregloPasos FROM tramite WHERE idTramite = ? AND activoTramite = 1", [idTramite])
      .then(([rows, data]) => {
        return rows[0].arregloPasos;
      })
      .catch((error) => {
        console.log(error);
        return 0;
      });
  }

}

