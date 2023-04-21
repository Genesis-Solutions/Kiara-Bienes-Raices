const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

// -- LOGIN -- //

// - Getter de la vista Login
exports.getLogin = (req, res, next) => {
    res.render("login", {
        emailUsuario: req.session.emailUsuario ? req.session.emailUsuario : "",
        info: "",
    });
};

exports.login = (req, res, next) => {
    User.findOne(req.body.emailUsuario)
        .then(async ([rows, data]) => {
            //Si no existe el correo, redirige a la pantalla de login

            if (rows.length < 1) {
                return response.redirect("/login");
            }

            // Información del usuario:

            req.session.isLoggedIn = true;
            req.session.idUsuario = rows[0].idUsuario;
            req.session.nombreUsuario = rows[0].nombre;
            req.session.apellidosUsuario = rows[0].apellidosUsuario;
            req.session.emailUsuario = rows[0].emailUsuario;

            // Contraseña del usuario:

            req.session.passwordUsuario = rows[0].passwordUsuario;

            // Método de comparación para determinar autenticidad de la contraseña:

            bcrypt
                .compare(req.body.passwordUsuario, req.session.passwordUsuario)
                .then((doMatch) => {
                    if (doMatch) {
                        console.log("success login");
                        return res.redirect("./");
                    } else {
                        return res.redirect("/login");
                    }
                });
        })
        .catch((error) => {
            console.log(error);
        });
};

// -- REGISTER -- //

exports.getRegister = (req, res, next) => {
    res.render("register");
};

exports.register = (req, res, next) => {
    const { nombreUsuario, apellidosUsuario, emailUsuario, telefonoUsuario, passwordUsuario, confirmPasswordUsuario, estadoCivilUsuario, ocupacionUsuario } = req.body;
    const activoUsuario = 1;
    const idRol = 2;
    const idFoto = 1;

        console.log(req.body.emailUsuario)
        User.findOne(req.body.emailUsuario)
        .then(async ([rows, data]) => {
            if (rows.length >= 1) {
                console.log("El correo electrónico ya está registrado.");
            }
        })
        .catch((error) => {
            console.log(error);
        });

    req.session.nombreUsuario = nombreUsuario;
    req.session.apellidosUsuario = apellidosUsuario;
    req.session.emailUsuario = emailUsuario;
    req.session.telefonoUsuario = telefonoUsuario;
    req.session.passwordUsuario = passwordUsuario;
    req.session.confirmPasswordUsuario = confirmPasswordUsuario;
    req.session.estadoCivilUsuario = estadoCivilUsuario;
    req.session.ocupacionUsuario = ocupacionUsuario;



    // Si todo fue validado correctamente, se inserta el usuario en la base de datos
    console.log(apellidosUsuario);
    User.insertUser(nombreUsuario, apellidosUsuario, emailUsuario, telefonoUsuario, passwordUsuario, estadoCivilUsuario, ocupacionUsuario, activoUsuario, idRol, idFoto
    )
        .then(() => {
            res.redirect("/");
        })
        .catch((error) => {
            console.log(error);
        });
};
