const db = require('../util/database');

module.exports = class Inmueble {

    // Obtener la informacion de un inmueble utilizando su id
    static getInmueble(idInmueble) {
        return db.execute('SELECT * FROM inmueble WHERE idInmueble=?', [idInmueble]).then(([rows, data]) => {
            console.log(rows)
            return rows;
        })
        .catch((error) => {
            console.log(error);
            return 0;
        });;
    }

    static getIdAgente(idInmueble) {
        return db.execute('SELECT idAgente FROM tramite WHERE idInmueble = ?', [idInmueble]);
    }

    static getInfoAgente(idAgente) { 
        ('SELECT * FROM usuario WHERE idUsuario = ?', [idAgente]) 
    }

    // //Obtener la informacion del Agente asignado a la propiedad con base al id del tramite
    // static getAgentInfo(idTramite) {
    //     return db.execute('SELECT u.idUsuario, u.nombreUsuario, u.telefonoUsuario, u.emailUsuario FROM usuario u JOIN tramite t ON u.idUsuario = t.idAgente WHERE t.idTramite=?', [idTramite]);
    // }

    // //Obtener la informacion del Agente asignado a la propiedad con base al id del tramite
    static getAgentInfo(idInmueble) {
        return db.execute('SELECT u.idUsuario, u.nombreUsuario, u.telefonoUsuario, u.emailUsuario FROM usuario u JOIN tramite t ON u.idUsuario = t.idAgente WHERE t.idTramite = (SELECT idTramite FROM tramite WHERE idInmueble=?)', [idInmueble]);
    }

    // Obtener el id de las fotos del inmueble
    static getIdFotosInmueble(idInmueble) {
        return db.execute('SELECT idFoto from fotoInmueble WHERE idInmueble = ? ORDER BY idFoto ASC', [idInmueble]);
    }

    // Obtener el src de las fotos del inmueble
    static getSrcFotosInmueble(idFoto) {
        return db.execute('SELECT archivoFoto FROM foto WHERE idFoto = ?', [idFoto]);
    }


    //obtener la informacion del usuario. Por id pero con la tabla de usuario
};

