const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/users');

// -- LOGIN -- //

// - Getter de la vista Login
exports.get_login = (req, res, next) => {
    res.render ('login', {
        email: req.session.email ? req.session.email : '',
        info: '',
    }); 
};

exports.login = (req, res, next) => {
    User.findOne (req.body.email).then (async ([rows, data]) => {

        //Si no existe el correo, redirige a la pantalla de login

        if (rows.length < 1) {
            return response.redirect('/login');
        };

        // Información del usuario:

        req.session.isLoggedIn = true;
        req.session.idUsuario = rows[0].idUsuario;
        req.session.nombreUsuario = rows[0].nombre;
        req.session.apellidosUsuario = rows[0].apellidosUsuario;
        req.session.emailUsuario = rows[0].emailUsuario;

        // Contraseña del usuario:

        request.session.passwordUsuario = rows[0].passwordUsuario;

        // Método de comparación para determinar autenticidad de la contraseña:

        bcrypt.compare(request.body.passwordUsuario, request.session.passwordUsuario).then(doMatch => {
            if (doMatch) {
                console.log('success login');
                return response.redirect('./');
            } else {
                return response.redirect('/login')
            }
        });

    }); 
};
