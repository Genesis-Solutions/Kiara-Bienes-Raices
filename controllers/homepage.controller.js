/**
* Base controlador
*/

const Inmueble = require('../models/inmueble.model.js');

exports.root = async(req,res,next) => {
    var isLogged = false;
    const idUsuario = req.session.idUsuario;
    const nombreUsuario = req.session.nombreUsuario;
    const apellidosUsuario = req.session.apellidosUsuario;
    const idRol = req.session.idRol;
    /** 
    * Construye la lista de inmuebles  con sus imágenes respectivas
    */
    const inmuebles = await Inmueble.fetchLastFour();
    for (let i=0; i < inmuebles[0].length; i++) {
        const imgId = await Inmueble.idFotoPortada((inmuebles[0][i].idInmueble.toString()));
        const imgSrc = await Inmueble.srcFotoPortada((imgId[0][0].idFoto).toString());
        const imgSrcFilename = (imgSrc[0][0].archivoFoto).slice(23);
        inmuebles[0][i].img = imgSrcFilename;
    }
    if (req.session.isLoggedIn == true) {
        isLogged = true;
        // console.log("logged = true");
        // console.log(nombreUsuario);
        //console.log("Id del rol del usuario en sesión: " + idRol);
        res.render('index', {
            isLogged: req.session.isLoggedIn,
            nombreUsuario: nombreUsuario,
            apellidosUsuario: apellidosUsuario,
            idUsuario: idUsuario,
            idRol: idRol,
            inmuebles: inmuebles[0]
        });
    } else {
        // console.log("logged = false");
        // console.log(isLogged);
        res.render('index', {
            isLogged: req.session.isLoggedIn,
            inmuebles: inmuebles[0]
        });
    };
}

/*
* Obtiene la imagen del bucket S3
*/
exports.getImgFromBucket = ( req,res,next ) => {
    var img = req.query.image;
    const AWS_BUCKET = "kiarabienesraices";
    console.log('Trying to download file: ' + img);
    var opciones = {
        Bucket: AWS_BUCKET,
        Key: img,
    };
    bucket.getObject(opciones, function(err, data) {
        res.attachment(img);
        res.send(data.Body);
    });
}
