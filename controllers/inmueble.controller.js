// Base controlador
const path = require('path');
const Inmueble = require('../models/inmueble.model');
const bucket = require("../util/awsBucket.js");

// Obtiene los datos del inmueble

exports.getInmueble = async (req, res, next) => {
    //Info de agente e inmueblee
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
    res.render('inmueble', {
        fotos: arregloFotos,
        inmuebles : inmueble,
        agente : agente,
        isLogged: req.session.isLoggedIn
    })
};

/*
* Obtener la imagen del bucket.
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