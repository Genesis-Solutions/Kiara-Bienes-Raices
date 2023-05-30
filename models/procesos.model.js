const db = require('../util/database.util');


module.exports = class Procesos {
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

    static getAgentInfo(idInmueble) {
        return db.execute(
          "SELECT u.idUsuario, u.nombreUsuario, u.telefonoUsuario, u.emailUsuario FROM usuario u JOIN tramite t ON u.idUsuario = t.idAgente WHERE t.idTramite = (SELECT idTramite FROM tramite WHERE idInmueble=?)",
          [idInmueble]
        );
    }
    
    static getInfoInmuebleTramiteAgente(idAgente) {
        return db.execute(
          "SELECT I.idInmueble, I.nombreInmueble, I.descInmueble, I.direccionInmueble, I.idFoto FROM inmueble I JOIN tramite TR ON I.idInmueble = TR.idInmueble WHERE TR.idAgente = ?",
          [idAgente]
        );
      }

    static getInfoInmuebleTramiteUsuario(idUsuario) {
    return db.execute(
        "SELECT I.idInmueble, I.nombreInmueble, I.descInmueble, I.direccionInmueble , I.idFoto FROM inmueble I JOIN tramite TR ON I.idInmueble = TR.idInmueble WHERE TR.idCliente OR TR.idArrendador = ?",
        [idUsuario]
    );
    }
}

