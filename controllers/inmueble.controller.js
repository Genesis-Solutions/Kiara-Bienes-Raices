// Base controlador
const path = require('path');
const Inmueble = require('../models/inmueble.model');
const bucket = require("../util/awsBucket.js");
const { link } = require('fs');

//  Controlador para obtener la información de un inmueble y renderizar su vista


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

//Controlador para eliminar una propiedad.
exports.eliminarPropiedad = (req, res, next) => {
    console.log("Adentro de controlador eliminar");
    const idInmueble = req.params.idInmueble;
    const activoInmueble = 0;
    Inmueble.eliminarPropiedad(activoInmueble, idInmueble);
}

/*
* Controlador para obtener la imagen del bucket.
*/
exports.getImgFromBucket = ( req,res,next ) => {
    var img = req.query.image;
    const AWS_BUCKET = "kiarabienesraices";
    //console.log('Trying to download file: ' + img);
    var opciones = {
        Bucket: AWS_BUCKET,
        Key: img,
    };
    bucket.getObject(opciones, function(err, data) {
        res.attachment(img);
        res.send(data.Body);
    });
}

exports.getEditarInmueble = async(req, res, next) => {
    //Info de agente e inmueblee
    const inmueble = await Inmueble.getInmueble(req.params.idInmueble);
    const idAgente = await Inmueble.getIdAgente(req.params.idInmueble);
    const agente = Inmueble.getInfoAgente(idAgente);
    const listaPropietarios = await Inmueble.fetchClientes();
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
        idRol: req.session.idRol,
        listaPropietarios: listaPropietarios[0]
    })
}

// -- MODIFY A PROPERTY AGENT OR ADMIN --//

//Controlador para actualizar los datos de una propiedad de tipo "Casa"
exports.updateBodyCasa = (req,res,next) => {
    console.log("Entrando a la ruta update body casa");
    //Elementos obligatorios del formulario
    const {
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
        idPropietario,
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
    console.log(req.body);
    console.log("tipoMovimiento",tipoMovimiento);
    console.log("precioVenta",precioVenta);
    console.log("precioRenta",precioRenta);
    console.log("cocina",cocina);
    console.log("cisterna",cisterna);
    console.log("cuartoServicio",cuartoServicio);
    console.log("salaTV",salaTV);
    console.log("estudio",estudio);
    console.log("roofGarden",roofGarden);
    console.log("areaLavado",areaLavado);
    console.log("vigilancia",vigilancia);
    console.log("jardin",jardin);
    console.log("bodega",bodega);
    const idInmueble = req.params.idInmueble;
    console.log("idInmueble",idInmueble);
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
        idPropietario,
        activoInmueble,
        idInmueble
    );
    res.redirect('/inmueble/'+idInmueble);
};

//Controlador para actualizar los datos de una propiedad de tipo "Local"

exports.updateBodyLocal = (req,res,next) => {
    console.log("Entrando a la ruta update body local");
    const {
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
        idPropietario,
        desc
    } = req.body;
    //Obtener el tipo de movimiento y los respectivos precios
    //Obtener el tipo de movimiento y los respectivos precios
    const venta = req.body.venta ? 1 : 0;
    const renta = req.body.renta ? 1 : 0;
    const activoInmueble = req.body.activoInmueble ? 1 : 0;
    console.log("activoInmuebleeeee: "+ activoInmueble);
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
    console.log("idInmueble",idInmueble);
    console.log("titulo: " + titulo);
    console.log("tipoMovimiento: " + tipoMovimiento);
    console.log("linkVideo: " + linkVideo);
    console.log("PrecioRenta: " + precioRenta);
    console.log("PrecioVenta: " + precioVenta);
    console.log("medidaFrente: " + medidaFrente);
    console.log("medidaFondo: " + medidaFondo);
    console.log("niveles: " + niveles);
    console.log("cuartosPrivados: " + cuartosPrivadosInmueble);
    console.log("mediosBanios: " + mediosBanios);
    console.log("usoSuelo: " + usoSuelo);
    console.log("ubicado: "+ubicado);
    console.log("CuotaMantenimiento: "+ cuotaMantenimiento);
    console.log("cocina: "+ cocina);
    console.log("cisterna" + cisterna);
    console.log("cuartoServicio: "+ cuartoServicio);
    console.log("fechaConstruccion: " + fechaConstruccion);
    console.log("vigilancia: " + vigilancia);
    console.log("tipoGas: " + tipoGas);
    console.log("estacionamientos: " + estacionamientos);
    console.log("banios: " + banios);
    console.log("desc: " + desc);
    console.log("direccion: " + direccion);
    console.log("linkMaps: " + linkMaps);
    console.log("idPropietario: " + idPropietario);
    console.log("idInmueble: " + idInmueble);
    console.log("activoInmueble: " + activoInmueble);
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
        idPropietario,
        activoInmueble,
        idInmueble
    );
    res.redirect('/inmueble/'+idInmueble);
};

//Controlador para actualizar los datos de una propiedad de tipo "Terreno"

exports.updateBodyTerreno = (req,res,next) => {
    console.log("Entrando a la ruta update body terreno");
    const {
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
        idPropietario,
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
    console.log("idInmueble", idInmueble);
    console.log(req.body);
    console.log(tipoMovimiento);
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
        idPropietario,
        activoInmueble,
        idInmueble 
    );
    res.redirect('/inmueble/' + idInmueble);
};

//Controlador para actualizar los datos de una propiedad de tipo "Bodega"

exports.updateBodyBodega = (req,res,next) => {
    console.log("Entrando a la ruta update body bodega");
    const {
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
        idPropietario,
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
    console.log("idInmueble",idInmueble);
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
        idPropietario,
        activoInmueble,
        idInmueble
    );
    res.redirect('/inmueble/'+idInmueble);
};

//Controlador para actualizar los datos de una propiedad de tipo "Oficina"

exports.updateBodyOficina = (req,res,next) => {
    console.log("Entrando a la ruta update body oficina");
    const {
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
        idPropietario,
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
    console.log("idInmueble",idInmueble);
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
        idPropietario,
        activoInmueble,
        idInmueble
    );
    res.redirect('/inmueble/'+idInmueble);
};

//Controlador para actualizar los datos de una propiedad de tipo "Otra"

exports.updateBodyOtra = (req,res,next) => {
    console.log("Entrando a la ruta update body otra");
    const {
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
        idPropietario,
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
    console.log("idInmueble",idInmueble);
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
        idPropietario,
        activoInmueble,
        idInmueble
    );
    res.redirect('/inmueble/'+idInmueble);
};