const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

// -- LOGIN -- //

// - Getter de la vista Login
exports.getLogin = (req, res, next) => {
    res.render ('login', {
        emailUsuario: req.session.emailUsuario ? req.session.emailUsuario : '',
        info: '',
    }); 
};

exports.login = (req, res, next) => {
    User.findOne (req.body.emailUsuario).then (async ([rows, data]) => {

        //Si no existe el correo, redirige a la pantalla de login

        if (rows.length < 1) {
            return response.redirect('/login');
        };

        // Información del usuario:

        req.session.isLoggedIn = true;
        req.session.idUsuario = rows[0].idUsuario;
        req.session.nombreUsuario = rows[0].nombreUsuario;
        req.session.apellidosUsuario = rows[0].apellidosUsuario;
        req.session.emailUsuario = rows[0].emailUsuario;
        req.session.idUsuario = rows[0].idUsuario;

        // console.log("en método login " + req.session.nombreUsuario)

        // Contraseña del usuario:

        req.session.passwordUsuario = rows[0].passwordUsuario;

        // Método de comparación para determinar autenticidad de la contraseña:

        bcrypt.compare(req.body.passwordUsuario, req.session.passwordUsuario).then(doMatch => {
            if (doMatch) {
                // console.log('success login');
                return res.redirect('./');
            } else {
                return res.redirect('/login')
            }
        });

    }).catch((error) => {
        console.log(error);
    }); 
};
