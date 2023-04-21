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
    const nombreUsuario = req.body.nombreUsuario;
    const apellidosUsuario = req.body.apellidosUsuario;
    const emailUsuario = req.body.emailUsuario;
    const telefonoUsuario = req.body.telefonoUsuario;
    const passwordUsuario = req.body.passwordUsuario;
    const confirmPasswordUsuario = req.body.confirmPasswordUsuario;
    const estadoCivilUsuario = req.body.estadoCivilUsuario;
    const ocupacionUsuario = req.body.ocupacionUsuario;
    console.log(nombreUsuario);

    // Revisar si el correo ya está registrado
    User.findOne(emailUsuario)
        .then(async ([rows, data]) => {
            if (rows.length >= 1) {
                errors.push("El correo electrónico ya está registrado.");
                res.render("register", { errors });
            }
        });

    try {
        // Generar la sal y el hash de la contraseña
        const salt = bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(passwordUsuario, salt);
    } catch (error) {
        console.log(error);
    }

    console.log(nombreUsuario);

    // Si todo fue validado correctamente, se inserta el usuario en la base de datos
    console.log(apellidosUsuario);
    User.insertUser(nombreUsuario, apellidosUsuario, estadoCivilUsuario, telefonoUsuario, emailUsuario, hashedPassword, ocupacionUsuario
    )
        .then(() => {
            res.redirect("/");
        })
        .catch((error) => {
            console.log(error);
        });
};
