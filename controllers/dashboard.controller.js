const path = require("path");
const User = require("../models/dashboard.model");
const Dashboard = require("../models/dashboard.model");
const { info } = require("console");

// -- LIST USERS -- //
exports.getDashboard = (req, res, next) => {
    // Renderizar la vista de registro
    res.render("listUsers", {
        isLogged: req.session.isLoggedIn,
        idRol: req.session.idRol,
    });
};

exports.getUsers = async (req, res, next) => {
    const dataUsers = await Dashboard.fetchAllUsers();
    res.status(200).json({ code: 200, code: "Ok", data: dataUsers[0] });
};

// -- REGISTER A NEW USER FROM A ROLE ADMIN --//

exports.getAdminUser = (req, res, next) => {
    if (req.session.isLoggedIn == true) {
        isLogged = true;
        res.render("adminUserRegistration", {
            isLogged: req.session.isLoggedIn,
            idRol: req.session.idRol,
        });
    }
};
exports.postAdminUser = (req, res, next) => {
    const {
        nombreUsuario,
        apellidosUsuario,
        emailUsuario,
        telefonoUsuario,
        passwordUsuario,
        passwordUsuarioConfirmar,
        estadoCivilUsuario,
        ocupacionUsuario,
        rolUsuario,
    } = req.body;

    const activoUsuario = 1;
    const idFoto = 1;

    // Convertir los valores numericos a string
    telefonoUsuarioString = telefonoUsuario.toString();
    activoUsuarioString = activoUsuario.toString();
    idRolString = rolUsuario.toString();
    idFotoString = idFoto.toString();

    // Revisar que el correo no esté registrado
    Dashboard.findOne(emailUsuario)
        .then(async ([rows, data]) => {
            if (rows.length >= 1) {
                console.log("El correo electrónico ingresado ya está registrado.");
                const errorEmail = "El correo electrónico ingresado ya está registrado";
                if (req.session.isLoggedIn == true) {
                    isLogged = true;
                    res.render("adminUserRegistration", {
                        isLogged: req.session.isLoggedIn,
                        idRol: req.session.idRol,
                        errorEmail,
                    });
                }
                // res.render("adminUserRegistration", { errorEmail });
            } else {
                //Revisar que las contraseñas coincidan
                if (passwordUsuario == passwordUsuarioConfirmar) {
                    console.log("Las contraseñas coinciden.");
                    // Si todo fue validado correctamente, se inserta el usuario en la base de datos
                    Dashboard.adminInsertUser(
                        nombreUsuario,
                        apellidosUsuario,
                        passwordUsuario,
                        telefonoUsuarioString,
                        emailUsuario,
                        estadoCivilUsuario,
                        ocupacionUsuario,
                        activoUsuarioString,
                        idRolString,
                        idFotoString
                    )
                        .then(() => {
                            res.redirect("/dashboard");
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                } else {
                    console.log("Las contraseñas no coinciden");
                    const errorPassword = "Las contraseñas no coinciden";
                    if (req.session.isLoggedIn == true) {
                        isLogged = true;
                        res.render("adminUserRegistration", {
                            isLogged: req.session.isLoggedIn,
                            idRol: req.session.idRol,
                            errorPassword,
                        });
                    }
                    // res.render("adminUserRegistration", { errorPassword });
                }
            }
        })
        .catch((error) => {
            console.log(error);
        });
};
