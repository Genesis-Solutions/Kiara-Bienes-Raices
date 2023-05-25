// Base controlador
const Inmueble = require('../models/inmueble.model');
const bucket = require("../util/awsBucket.js");
const linkYoutubeKiara = 'https://www.youtube.com/@kiarabienesraices/featured';
const mapaPorDefecto = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14939.700429428109!2d-100.40389240351634!3d20.591115845212013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d35b2a918d2dc1%3A0x35673f825669f344!2sCentro%2C%2076000%20Santiago%20de%20Quer%C3%A9taro%2C%20Qro.!5e0!3m2!1ses!2smx!4v1685044595433!5m2!1ses!2smx" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';

/*
 * Obtiene información de un inmueble y renderiza la vista correspondiente.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {function} next - Función de middleware de Express.
 * @returns {void}
 */
exports.getInmueble = async (req, res, next) => {
    //Info de agente e inmueblee
    const inmueble = await Inmueble.getInmueble(req.params.idInmueble);
    // activoInmueble ya viene en inmueble
    const idAgente = await Inmueble.getIdAgente(req.params.idInmueble);
    //console.log("Este es el id del inmueble ", req.params.idInmueble);
    const aTramite = await Inmueble.getActivoTramite(req.params.idInmueble);
    let tramite = 0;
    if (aTramite.length <= 0 ){
        tramite = 0;
    } else {
        tramite = aTramite[0].activoTramite;
    }
    //console.log("Este es el activo tramite 2",tramite);
    const agente = Inmueble.getInfoAgente(idAgente);
    const listaAttributesInmueble = await Inmueble.fetchAttritubutesInmueble(req.params.idInmueble);
    //Imagenes
    const idFotos = await Inmueble.getIdFotosInmueble(req.params.idInmueble);
    //console.log(idFotos[0]);
    arregloFotos = [];
    for (let i=0; i < idFotos[0].length; i++) {
        //console.log(idFotos[0][i].idFoto);
        const imgSrc = await Inmueble.getSrcFotosInmueble((idFotos[0][i].idFoto));
        const imgSrcFilename = (imgSrc[0][0].archivoFoto).slice(23);
        arregloFotos.push(imgSrcFilename);
    }
    //console.log(arregloFotos);
    res.render('inmueble', {
        tituloInmueble: inmueble.nombreInmueble,
        fotoPortada: arregloFotos[0],
        fotos: arregloFotos,
        inmuebles : inmueble,
        agente : agente,
        isLogged: req.session.isLoggedIn,
        idRol: req.session.idRol,
        idInmueble: req.params.idInmueble,
        tramite: tramite,
        idUsuario: req.session.idUsuario,
        listaAttributesInmueble: listaAttributesInmueble[0]
    })
};

/*
 * Elimina una propiedad cambiando su estado a inactivo.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {function} next - Función de middleware de Express.
 * @returns {void}
 */
exports.eliminarPropiedad = (req, res, next) => {
    console.log("Adentro de controlador eliminar");
    const idInmueble = req.params.idInmueble;
    const activoInmueble = 2;
    Inmueble.eliminarPropiedad(activoInmueble, idInmueble);
}

/*
 * Desactiva una propiedad cambiando su estado a inactivo.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {function} next - Función de middleware de Express.
 * @returns {void}
 */
exports.desactivarPropiedad = (req, res, next) => {
    console.log("Adentro de controlador eliminar");
    const idInmueble = req.params.idInmueble;
    const activoInmueble = 0;
    Inmueble.desactivarPropiedad(activoInmueble, idInmueble);
}

/*
 * Obtiene una imagen desde un bucket de Amazon S3 y la envía como respuesta en el objeto de respuesta de Express.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {function} next - Función de middleware de Express.
 * @returns {void}
 */
exports.getImgFromBucket = ( req,res,next ) => {
    //Obtiene el nombre de la imagen de la consulta
    var img = req.query.image;
    const AWS_BUCKET = "kiarabienesraices";
    //console.log('Trying to download file: ' + img);
    //Configura las opciones de la solicitud de objeto
    var opciones = {
        Bucket: AWS_BUCKET,
        Key: img,
    };
    //Obtiene el objeto del bucket de Amazon S3 y envía la imagen como respuesta
    bucket.getObject(opciones, function(err, data) {
        if (err) {
            console.log("Error imgFromBucket: "+err);
        } else {
            res.attachment(img);
            res.send(data.Body);
        }
    });
}


/*
 * Renderiza la vista de edición de un inmueble, recuperando información necesaria para su presentación.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {function} next - Función middleware para pasar el control al siguiente middleware.
 * @returns {Promise} - Promesa que resuelve con la presentación de la vista de edición de inmueble.
*/
exports.getEditarInmueble = async(req, res, next) => {
    //Info de agente e inmueble
    const inmueble = await Inmueble.getInmueble(req.params.idInmueble);
    const idAgente = await Inmueble.getIdAgente(req.params.idInmueble);
    const agente = Inmueble.getInfoAgente(idAgente);
    //Imagenes
    const idFotos = await Inmueble.getIdFotosInmueble(req.params.idInmueble);
    //console.log(idFotos[0]);
    arregloFotos = [];
    for (let i=0; i < idFotos[0].length; i++) {
        //console.log(idFotos[0][i].idFoto);
        const imgSrc = await Inmueble.getSrcFotosInmueble((idFotos[0][i].idFoto));
        const imgSrcFilename = (imgSrc[0][0].archivoFoto).slice(23);
        arregloFotos.push(imgSrcFilename);
    }
    //console.log(arregloFotos);
    res.render('editarInmueble', {
        fotos: arregloFotos,
        inmuebles : inmueble,
        agente : agente,
        isLogged: req.session.isLoggedIn,
        idRol: req.session.idRol
    })
}

/*
 * Actualiza los detalles de una casa en la base de datos.
 * @param req La solicitud HTTP que contiene los datos del formulario.
 * @param res La respuesta HTTP que se enviará al navegador.
 * @param next El siguiente middleware en la cadena de middleware.
 * @throws SQLException Si ocurre un error al interactuar con la base de datos.
 */
exports.updateBodyCasa = (req,res,next) => {
    //console.log("Entrando a la ruta update body casa");
    //Elementos obligatorios del formulario
    let {
        titulo,
        linkVideo,
        m2Terreno,
        niveles,
        mediosBanios,
        cuotaMantenimiento,
        fechaConstruccion,
        usoSuelo,
        ubicado,
        tipoGas,
        m2Construccion,
        recamaras,
        estacionamientos,
        banios,
        desc,
        direccion,
        linkMaps,
    } = req.body;
    //Obtener el tipo de movimiento y los respectivos precios
    const venta = req.body.venta ? 1 : 0;
    const renta = req.body.renta ? 1 : 0;
    const activoInmueble = req.body.activoInmueble ? 1 : 0;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if(venta === 1 && renta === 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta;
        precioRenta = 0;
    }else if (venta === 0 && renta === 1) {
        tipoMovimiento = 2
        precioRenta = req.body.precioRenta;
        precioVenta = 0;
    }
    //Obtener amenidades adicionales
    const cocina = req.body.cocina ? 1 : 0;
    const cisterna = req.body.cisterna ? 1 : 0;
    const cuartoServicio = req.body.cuartoServicio ? 1 : 0;
    const salaTV = req.body.salaTV ? 1 : 0;
    const estudio = req.body.estudio ? 1 : 0;
    const roofGarden = req.body.roofGarden ? 1 : 0;
    const areaLavado = req.body.areaLavado ? 1 : 0;
    const vigilancia = req.body.vigilancia ? 1 : 0;
    const jardin = req.body.jardin ? 1 : 0;
    const bodega = req.body.bodega ? 1 : 0;
    const idInmueble = req.params.idInmueble;
    /*
    *Mapas y videos opcionales. Valores por defecto
    */
    if (linkVideo == "" || linkVideo == null) {
        linkVideo = linkYoutubeKiara;
    }
    if (linkMaps == "" || linkMaps == null) {
        linkMaps = mapaPorDefecto;
    }
    if (m2Terreno == "" || m2Terreno == null) {
        m2Terreno = 0;
    }
    if (m2Construccion == "" || m2Construccion == null) {
        m2Construccion = 0;
    }
    if (recamaras == "" || recamaras == null) {
        recamaras = 0;
    }
    if (estacionamientos == "" || estacionamientos == null) {
        estacionamientos = 0;
    }
    if (banios == "" || banios == null) {
        banios = 0;
    }
    if (niveles == "" || niveles == null) {
        niveles = 0;
    }
    if (mediosBanios == "" || mediosBanios == null) {
        mediosBanios = 0;
    }
    if (cuotaMantenimiento == "" || cuotaMantenimiento == null) {
        cuotaMantenimiento = 0;
    }
    if (fechaConstruccion == "" || fechaConstruccion == null) {
        fechaConstruccion = 0;
    }

    Inmueble.changeInmuebleCasa(
        titulo,
        desc,
        tipoMovimiento,
        linkVideo,
        precioVenta,
        precioRenta,
        m2Terreno,
        m2Construccion,
        niveles,
        mediosBanios,
        cuotaMantenimiento,
        fechaConstruccion,
        usoSuelo,
        ubicado,
        tipoGas,
        recamaras,
        estacionamientos,
        banios,
        cocina,
        cisterna,
        cuartoServicio,
        salaTV,
        estudio,
        roofGarden,
        areaLavado,
        vigilancia,
        jardin,
        bodega,
        direccion,
        linkMaps,
        activoInmueble,
        idInmueble
    );
    res.redirect('/catalogo');
};

/*
 * Actualiza los detalles de un Local en la base de datos.
 * @param req La solicitud HTTP que contiene los datos del formulario.
 * @param res La respuesta HTTP que se enviará al navegador.
 * @param next El siguiente middleware en la cadena de middleware.
 * @throws SQLException Si ocurre un error al interactuar con la base de datos.
 */
exports.updateBodyLocal = (req,res,next) => {
    //console.log("Entrando a la ruta update body local");
    let {
        titulo,
        linkVideo,
        m2Terreno,
        m2Construccion,
        medidaFrente,
        medidaFondo,
        niveles,
        cuartosPrivadosInmueble,
        mediosBanios,
        usoSuelo,
        ubicado,
        cuotaMantenimiento,
        fechaConstruccion,
        tipoGas,
        estacionamientos,
        banios,
        direccion,
        linkMaps,
        desc
    } = req.body;
    //Obtener el tipo de movimiento y los respectivos precios
    //Obtener el tipo de movimiento y los respectivos precios
    const venta = req.body.venta ? 1 : 0;
    const renta = req.body.renta ? 1 : 0;
    const activoInmueble = req.body.activoInmueble ? 1 : 0;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if(venta === 1 && renta === 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta;
        precioRenta = req.body.precioRenta;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta;
    }else if (venta === 0 && renta === 1) {
        tipoMovimiento = 2
        precioRenta = req.body.precioRenta;
    }
    const cocina = req.body.cocina ? 1 : 0;
    const cisterna = req.body.cisterna ? 1 : 0;
    const cuartoServicio = req.body.cuartoServicio ? 1 : 0;
    const vigilancia = req.body.vigilancia ? 1 : 0;
    const idInmueble = req.params.idInmueble;
    /*
    *Mapas y videos opcionales. Valores por defecto
    */
    if (linkVideo == "" || linkVideo == null) {
        linkVideo = linkYoutubeKiara;
    }
    if (linkMaps == "" || linkMaps == null) {
        linkMaps = mapaPorDefecto;
    }
    if (m2Terreno == "" || m2Terreno == null) {
        m2Terreno = 0;
    }
    if (m2Construccion == "" || m2Construccion == null) {
        m2Construccion = 0;
    }
    if (medidaFrente == "" || medidaFrente == null) {
        medidaFrente = 0;
    }
    if (medidaFondo == "" || medidaFondo == null) {
        medidaFondo = 0;
    }
    if (niveles == "" || niveles == null) {
        niveles = 0;
    }
    if (cuartosPrivadosInmueble == "" || cuartosPrivadosInmueble == null) {
        cuartosPrivadosInmueble = 0;
    }
    if (mediosBanios == "" || mediosBanios == null) {
        mediosBanios = 0;
    }
    if (cuotaMantenimiento == "" || cuotaMantenimiento == null) {
        cuotaMantenimiento = 0;
    }
    if (fechaConstruccion == "" || fechaConstruccion == null) {
        fechaConstruccion = 0;
    }
    if (estacionamientos == "" || estacionamientos == null) {
        estacionamientos = 0;
    }
    if (banios == "" || banios == null) {
        banios = 0;
    }

    Inmueble.changeInmuebleLocal(
        titulo,
        tipoMovimiento,
        linkVideo,
        precioVenta,
        precioRenta,
        m2Terreno,
        m2Construccion,
        medidaFrente,
        medidaFondo,
        niveles,
        cuartosPrivadosInmueble,
        mediosBanios,
        usoSuelo,
        ubicado,
        cuotaMantenimiento,
        cocina,
        cisterna,
        cuartoServicio,
        fechaConstruccion,
        vigilancia,
        tipoGas,
        estacionamientos,
        banios,
        desc,
        direccion,
        linkMaps,
        activoInmueble,
        idInmueble
    );
    res.redirect('/catalogo');
};

/*
 * Actualiza los detalles de un Terreno en la base de datos.
 * @param req La solicitud HTTP que contiene los datos del formulario.
 * @param res La respuesta HTTP que se enviará al navegador.
 * @param next El siguiente middleware en la cadena de middleware.
 * @throws SQLException Si ocurre un error al interactuar con la base de datos.
 */
exports.updateBodyTerreno = (req,res,next) => {
    console.log("Entrando a la ruta update body terreno");
    let {
        titulo,
        linkVideo,
        m2Terreno,
        m2Construccion,
        medidaFrente,
        medidaFondo,
        usoSuelo,
        ubicado,
        tipoSuelo,
        cuotaMantenimiento,
        direccion,
        linkMaps,
        desc,
    } = req.body;
    //Obtener el tipo de movimiento y los respectivos precios
    const venta = req.body.venta ? 1 : 0;
    const renta = req.body.renta ? 1 : 0;
    const activoInmueble = req.body.activoInmueble ? 1 : 0;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if(venta == 1 && renta == 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta;
        precioRenta = req.body.precioRenta;
    } else if (venta == 1 && renta == 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta;
    }else if (venta == 0 && renta == 1) {
        tipoMovimiento = 2
        precioRenta = req.body.precioRenta;
    }
    const servicioAgua = req.body.servicioAgua ? 1 : 0;
    const servicioLuz = req.body.servicioLuz ? 1 : 0;
    const servicioDrenaje = req.body.servicioDrenaje ? 1 : 0;
    const vigilancia = req.body.vigilancia ? 1 : 0;
    const idInmueble = req.params.idInmueble;
    /*
    *Mapas y videos opcionales. Valores por defecto
    */
    if (linkVideo == "" || linkVideo == null) {
        linkVideo = linkYoutubeKiara;
    }
    if (linkMaps == "" || linkMaps == null) {
        linkMaps = mapaPorDefecto;
    }
    if (m2Terreno == "" || m2Terreno == null) {
        m2Terreno = 0;
    }
    if (m2Construccion == "" || m2Construccion == null) {
        m2Construccion = 0;
    }
    if (medidaFrente == "" || medidaFrente == null) {
        medidaFrente = 0;
    }
    if (medidaFondo == "" || medidaFondo == null) {
        medidaFondo = 0;
    }
    if (cuotaMantenimiento == "" || cuotaMantenimiento == null) {
        cuotaMantenimiento = 0;
    }

    Inmueble.changeInmuebleTerreno(
        titulo,
        tipoMovimiento,
        linkVideo,
        precioVenta,
        precioRenta,
        m2Terreno,
        m2Construccion,
        medidaFrente,
        medidaFondo,
        usoSuelo,
        ubicado,
        servicioAgua,
        servicioLuz,
        servicioDrenaje,
        tipoSuelo,
        cuotaMantenimiento,
        vigilancia,
        desc,
        direccion,
        linkMaps,
        activoInmueble,
        idInmueble 
    );
    res.redirect('/catalogo');
};

/*
 * Actualiza los detalles de una Bodega en la base de datos.
 * @param req La solicitud HTTP que contiene los datos del formulario.
 * @param res La respuesta HTTP que se enviará al navegador.
 * @param next El siguiente middleware en la cadena de middleware.
 * @throws SQLException Si ocurre un error al interactuar con la base de datos.
 */
exports.updateBodyBodega = (req,res,next) => {
    console.log("Entrando a la ruta update body bodega");
    let {
        titulo,
        linkVideo,
        m2Terreno,
        m2Construccion,
        medidaFrente,
        medidaFondo,
        niveles,
        cuartosPrivadosInmueble,
        mediosBanios,
        usoSuelo,
        ubicado,
        cuotaMantenimiento,
        fechaConstruccion,
        muros,
        altura,
        tipoPiso,
        tipoLuz,
        estacionamientos,
        banios,
        direccion,
        linkMaps,
        desc
    } = req.body;
    //Obtener el tipo de movimiento y los respectivos precios
    const venta = req.body.venta ? 1 : 0;
    const renta = req.body.renta ? 1 : 0;
    const activoInmueble = req.body.activoInmueble ? 1 : 0;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if(venta === 1 && renta === 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta;
        precioRenta = req.body.precioRenta;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta;
    }else if (venta === 0 && renta === 1) {
        tipoMovimiento = 2
        precioRenta = req.body.precioRenta;
    }
    const cocina = req.body.cocina ? 1 : 0;
    const cisterna = req.body.cisterna ? 1 : 0;
    const vigilancia = req.body.vigilancia ? 1 : 0;
    const generadorElectrico = req.body.generadorElectrico ? 1 : 0;
    const andenCarga = req.body.andenCarga ? 1 : 0;
    const oficina = req.body.oficina ? 1 : 0;
    const patioManiobras = req.body.patioManiobras ? 1 : 0;
    const idInmueble = req.params.idInmueble;
    /*
    *Mapas y videos opcionales. Valores por defecto
    */
    if (linkVideo == "" || linkVideo == null) {
        linkVideo = linkYoutubeKiara;
    }
    if (linkMaps == "" || linkMaps == null) {
        linkMaps = mapaPorDefecto;
    }
    if (m2Terreno == "" || m2Terreno == null) {
        m2Terreno = 0;
    }
    if (m2Construccion == "" || m2Construccion == null) {
        m2Construccion = 0;
    }
    if (medidaFrente == "" || medidaFrente == null) {
        medidaFrente = 0;
    }
    if (medidaFondo == "" || medidaFondo == null) {
        medidaFondo = 0;
    }
    if (niveles == "" || niveles == null) {
        niveles = 0;
    }
    if (cuartosPrivadosInmueble == "" || cuartosPrivadosInmueble == null) {
        cuartosPrivadosInmueble = 0;
    }
    if (mediosBanios == "" || mediosBanios == null) {
        mediosBanios = 0;
    }
    if (cuotaMantenimiento == "" || cuotaMantenimiento == null) {
        cuotaMantenimiento = 0;
    }
    if (fechaConstruccion == "" || fechaConstruccion == null) {
        fechaConstruccion = 0;
    }
    if (estacionamientos == "" || estacionamientos == null) {
        estacionamientos = 0;
    }
    if (banios == "" || banios == null) {
        banios = 0;
    }
    if (altura == "" || altura == null) {
        altura = 0;
    }
    if (muros == "" || muros == null) {
        muros = 0;
    }
    if (oficina == "" || oficina == null) {
        oficina = 0;
    }
    Inmueble.changeInmuebleBodega(
        titulo,
        tipoMovimiento,
        linkVideo,
        precioVenta,
        precioRenta,
        m2Terreno,
        m2Construccion,
        medidaFrente,
        medidaFondo,
        niveles,
        cuartosPrivadosInmueble,
        mediosBanios,
        estacionamientos,
        usoSuelo,
        ubicado,
        cuotaMantenimiento,
        cocina,
        cisterna,
        fechaConstruccion,
        vigilancia,
        generadorElectrico,
        andenCarga,
        oficina,
        patioManiobras,
        muros,
        altura,
        tipoPiso,
        tipoLuz,
        banios,
        desc,
        direccion,
        linkMaps,
        activoInmueble,
        idInmueble
    );
    res.redirect('/catalogo');
};

/*
 * Actualiza los detalles de una Oficina en la base de datos.
 * @param req La solicitud HTTP que contiene los datos del formulario.
 * @param res La respuesta HTTP que se enviará al navegador.
 * @param next El siguiente middleware en la cadena de middleware.
 * @throws SQLException Si ocurre un error al interactuar con la base de datos.
 */
exports.updateBodyOficina = (req,res,next) => {
    console.log("Entrando a la ruta update body oficina");
    let {
        titulo,
        linkVideo,
        m2Terreno,
        m2Construccion,
        niveles,
        cuartosPrivadosInmueble,
        mediosBanios,
        usoSuelo,
        ubicado,
        cuotaMantenimiento,
        fechaConstruccion,
        estacionamientos,
        banios,
        direccion,
        linkMaps,
        desc
    } = req.body;
    //Obtener el tipo de movimiento y los respectivos precios
    const venta = req.body.venta ? 1 : 0;
    const renta = req.body.renta ? 1 : 0;
    const activoInmueble = req.body.activoInmueble ? 1 : 0;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if(venta === 1 && renta === 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta;
        precioRenta = req.body.precioRenta;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta;
    }else if (venta === 0 && renta === 1) {
        tipoMovimiento = 2
        precioRenta = req.body.precioRenta;
    }
    const cocina = req.body.cocina ? 1 : 0;
    const cisterna = req.body.cisterna ? 1 : 0;
    const vigilancia = req.body.vigilancia ? 1 : 0;
    const idInmueble = req.params.idInmueble;
    /*
    *Mapas y videos opcionales. Valores por defecto
    */
    if (linkVideo == "" || linkVideo == null) {
        linkVideo = linkYoutubeKiara;
    }
    if (linkMaps == "" || linkMaps == null) {
        linkMaps = mapaPorDefecto;
    }
    if (m2Terreno == "" || m2Terreno == null) {
        m2Terreno = 0;
    }
    if (m2Construccion == "" || m2Construccion == null) {
        m2Construccion = 0;
    }
    if (niveles == "" || niveles == null) {
        niveles = 0;
    }
    if (cuartosPrivadosInmueble == "" || cuartosPrivadosInmueble == null) {
        cuartosPrivadosInmueble = 0;
    }
    if (mediosBanios == "" || mediosBanios == null) {
        mediosBanios = 0;
    }
    if (cuotaMantenimiento == "" || cuotaMantenimiento == null) {
        cuotaMantenimiento = 0;
    }
    if (fechaConstruccion == "" || fechaConstruccion == null) {
        fechaConstruccion = 0;
    }
    if (estacionamientos == "" || estacionamientos == null) {
        estacionamientos = 0;
    }
    if (banios == "" || banios == null) {
        banios = 0;
    }
    Inmueble.changeInmuebleOficina(
        titulo,
        tipoMovimiento,
        linkVideo,
        precioVenta,
        precioRenta,
        m2Terreno,
        m2Construccion,
        niveles,
        cuartosPrivadosInmueble,
        mediosBanios,
        usoSuelo,
        ubicado,
        cuotaMantenimiento,
        cocina,
        cisterna,
        fechaConstruccion,
        vigilancia,
        estacionamientos,
        banios,
        direccion,
        desc,
        linkMaps,
        activoInmueble,
        idInmueble
    );
    res.redirect('/catalogo');
};

/*
 * Actualiza los detalles de un Inmueble tipo Otro en la base de datos.
 * @param req La solicitud HTTP que contiene los datos del formulario.
 * @param res La respuesta HTTP que se enviará al navegador.
 * @param next El siguiente middleware en la cadena de middleware.
 * @throws SQLException Si ocurre un error al interactuar con la base de datos.
 */
exports.updateBodyOtra = (req,res,next) => {
    console.log("Entrando a la ruta update body otra");
    let {
        titulo,
        linkVideo,
        m2Terreno,
        m2Construccion,
        niveles,
        recamaras,
        cuartosPrivadosInmueble,
        mediosBanios,
        usoSuelo,
        ubicado,
        cuotaMantenimiento,
        estacionamientos,
        banios,
        direccion,
        linkMaps,
        desc
    } = req.body;
    //Obtener el tipo de movimiento y los respectivos precios
    const venta = req.body.venta ? 1 : 0;
    const renta = req.body.renta ? 1 : 0;
    const activoInmueble = req.body.activoInmueble ? 1 : 0;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if(venta === 1 && renta === 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta;
        precioRenta = req.body.precioRenta;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta;
    }else if (venta === 0 && renta === 1) {
        tipoMovimiento = 2
        precioRenta = req.body.precioRenta;
    }
    const cocina = req.body.cocina ? 1 : 0;
    const cisterna = req.body.cisterna ? 1 : 0;
    const vigilancia = req.body.vigilancia ? 1 : 0;
    const idInmueble = req.params.idInmueble;
    /*
    *Mapas y videos opcionales. Valores por defecto
    */
    if (linkVideo == "" || linkVideo == null) {
        linkVideo = linkYoutubeKiara;
    }
    if (linkMaps == "" || linkMaps == null) {
        linkMaps = mapaPorDefecto;
    }
    if (m2Terreno == "" || m2Terreno == null) {
        m2Terreno = 0;
    }
    if (m2Construccion == "" || m2Construccion == null) {
        m2Construccion = 0;
    }
    if (niveles == "" || niveles == null) {
        niveles = 0;
    }
    if (recamaras == "" || recamaras == null) {
        recamaras = 0;
    }
    if (cuartosPrivadosInmueble == "" || cuartosPrivadosInmueble == null) {
        cuartosPrivadosInmueble = 0;
    }
    if (mediosBanios == "" || mediosBanios == null) {
        mediosBanios = 0;
    }
    if (cuotaMantenimiento == "" || cuotaMantenimiento == null) {
        cuotaMantenimiento = 0;
    }
    if (estacionamientos == "" || estacionamientos == null) {
        estacionamientos = 0;
    }
    if (banios == "" || banios == null) {
        banios = 0;
    }
    
    Inmueble.changeInmuebleOtra(
        titulo,
        tipoMovimiento,
        linkVideo,
        precioVenta,
        precioRenta,
        m2Terreno,
        m2Construccion,
        niveles,
        recamaras,
        cuartosPrivadosInmueble,
        mediosBanios,
        usoSuelo,
        ubicado,
        cuotaMantenimiento,
        cocina,
        cisterna,
        vigilancia,
        estacionamientos,
        banios,
        desc,
        direccion,
        linkMaps,
        activoInmueble,
        idInmueble
    );
    res.redirect('/catalogo');
};
