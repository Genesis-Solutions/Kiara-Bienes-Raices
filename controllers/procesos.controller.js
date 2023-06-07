const Procesos = require('../models/procesos.model');
const Inmueble = require('../models/inmueble.model');

/**
 * Clase que maneja la obtención de información de trámites y renderización de la vista 'procesosUsuario'.
 */
exports.getProcesos = async (req, res, next) => {

  try {
    const tramites = await Procesos.infoTramite(req.session.idUsuario);

    const data = await Promise.all(tramites.map(async (tramite) => {
      const tramiteId = tramite.idTramite;
      const nombreAgente = await Procesos.getNombreAgente(tramiteId)
      console.log(nombreAgente[0][0])
      const tramiteInfo = await Procesos.getDescTramite(tramiteId);
      const fotoInmueble = await Procesos.getFotoTramite(tramiteInfo[0].idInmueble);
      const imgSrc = await Inmueble.getSrcFotosInmueble(fotoInmueble[0][0].idFoto);
      const imgSrcFilename = (imgSrc[0][0].archivoFoto).slice(23);
      const info = {
        idInmueble: tramiteInfo[0].idInmueble,
        nombreInmueble: tramiteInfo[0].nombreInmueble,
        descInmueble: tramiteInfo[0].descInmueble,
        direccionInmueble: tramiteInfo[0].direccionInmueble,
        nombreAgente: nombreAgente[0][0].nombreUsuario,
        apellidosAgente: nombreAgente[0][0].apellidosUsuario,
        fotoInmueble: imgSrcFilename,
        idTramite: tramiteId
      };
      return info;
    }));

    res.render('procesosUsuario', {
      isLogged: req.session.isLoggedIn,
      idRol: req.session.idRol,
      urlFotoUsuario : req.session.urlFotoUsuario,
      data: data
    });
  } catch (error) {
    next(error);
  }
}