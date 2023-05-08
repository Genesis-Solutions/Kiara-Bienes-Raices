/**
* Base controlador
*/
exports.root = async(req,res,next) => {
    var isLogged = false;
    const idUsuario = req.session.idUsuario;
    const nombreUsuario = req.session.nombreUsuario;
    const apellidosUsuario = req.session.apellidosUsuario;
    const idRol = req.session.idRol;
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
            idRol: idRol
        });
    } else {
        // console.log("logged = false");
        // console.log(isLogged);
        res.render('index', {
            isLogged: req.session.isLoggedIn
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
