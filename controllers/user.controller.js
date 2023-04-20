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
    const {
        nombreUsuario,
        apellidosUsuario,
        emailUsuario,
        passwordUsuario,
        telefonoUsuario,
        estadoCivilUsuario,
        ocupacionUsuario,
    } = req.body;

    // Validar los datos de entrada
    const errors = validateInput(
        nombreUsuario,
        apellidosUsuario,
        emailUsuario,
        passwordUsuario,
        telefonoUsuario,
        estadoCivilUsuario,
        ocupacionUsuario
    );
    if (errors.length > 0) {
        res.render("register", { errors });
        return;
    }
    // revisar que las contraseñas coincidan
    const passwordError = validateConfirmPassword(
        passwordUsuario,
        confirmPasswordUsuario
    );
    if (passwordError.length > 0) {
        res.render("register", { errorsPassword });
        return;
    }

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

    function validateConfirmPassword(passwordUsuario, confirmPasswordUsuario) {
        const errors = [];
        if (passwordUsuario !== confirmPasswordUsuario) {
            errors.push("Las contraseñas no coinciden.");
        }
        return errors;
    }

    function validateInput(
        nombreUsuario,
        apellidosUsuario,
        emailUsuario,
        passwordUsuario,
        telefonoUsuario,
        estadoCivilUsuario,
        ocupacionUsuario
    ) {
        const errors = [];

        if (!nombreUsuario) {
            errors.push("El nombre es requerido.");
        } else if (!/^[a-zA-Z]+$/.test(nombreUsuario)) {
            errors.push("El nombre debe contener solo letras.");
        }

        if (!apellidosUsuario) {
            errors.push("Los apellidos son requeridos.");
        } else if (!/^[a-zA-Z]+$/.test(apellidosUsuario)) {
            errors.push("Los apellidos deben contener solo letras.");
        }

        if (!emailUsuario) {
            errors.push("El correo electrónico es requerido.");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push("Correo electrónico inválido.");
        }
        if (!passwordUsuario) {
            errors.push("Contraseña requerida.");
        } else if (password.length < 8) {
            errors.push("La contraseña debe tener al menos 8 caracteres.");
        }
        if (!telefonoUsuario) {
            errors.push("El teléfono es requerido.");
        } else if (!/^[0-9]+$/.test(phone_number)) {
            errors.push("El teléfono debe contener solo números.");
        }
        if (!estadoCivilUsuario) {
            errors.push(
                "Estado civil requerido. (Soltero, Casado,Bienes Mancomunados, Separado, Divorciado, Viudo)"
            );
        } else if (!/^[a-zA-Z]+$/.test(estadoCivilUsuario)) {
            errors.push("El estado civil debe contener solo letras.");
        }
        if (!/^[a-zA-Z]+$/.test(ocupacionUsuario)) {
            errors.push("La ocupación debe contener solo letras.");
        }

        // Prevent SQL injection attacks
        const sqlRegex = /['"\\]/g;
        if (
            sqlRegex.test(nombreUsuario) ||
            sqlRegex.test(apellidosUsuario) ||
            sqlRegex.test(emailUsuario) ||
            sqlRegex.test(passwordUsuario) ||
            sqlRegex.test(telefonoUsuario) ||
            sqlRegex.test(estadoCivilUsuario) ||
            sqlRegex.test(ocupacionUsuario)
        ) {
            errors.push("Entrada inválida.");
        }

        return errors;
    }

    // Si todo fue validado correctamente, se inserta el usuario en la base de datos
    User.insertUser(
        nombreUsuario,
        apellidosUsuario,
        estadoCivilUsuario,
        telefonoUsuario,
        emailUsuario,
        hashedPassword,
        ocupacionUsuario
    )
        .then(() => {
            res.redirect("/index");
        })
        .catch((error) => {
            console.log(error);
        });
};
