// Base controlador
const path = require('path');

exports.root = async (req, res, next) => {
    var isLogged = false;
    const nombreUsuario = req.session.nombreUsuario;
    const apellidosUsuario = req.session.apellidosUsuario;
    if (req.session.isLoggedIn == true) {
        isLogged = true;
        // console.log("logged = true");
        // console.log(nombreUsuario);

        res.render('index', {
            isLogged: req.session.isLoggedIn,
            nombreUsuario: nombreUsuario,
            apellidosUsuario: apellidosUsuario,
        });
    } else {
        // console.log("logged = false");
        // console.log(isLogged);
        res.render('index', {
            isLogged: req.session.isLoggedIn
        });
    };
}