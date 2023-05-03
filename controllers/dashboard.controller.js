/*
* Historia de usuario 1.5, 1.6 y 1.9 - Ver lista de usuarios, modificar rol y eliminar usuario.
* Controlador que maneja la lógica tras la llamada de las queriees de la lista de usuarios.
*/
const path = require('path');
const User = require('../models/dashboard.model');
const Dashboard = require('../models/dashboard.model');
const { info } = require('console');
/*
 * Renderización del dashboard tras realizar la validación de rol de usuario.
 */
// -- LIST USERS -- //
exports.getDashboard = (req, res, next) => {
    // Renderizar la vista de la lista de Usuarios
        res.render("listUsers", {
            isLogged: req.session.isLoggedIn,
            idRol: req.session.idRol,
        });

};

exports.getDashboardProps = (req, res, next) => {
    // Renderizar la vista de la lista de Propiedades
    res.render("dashboardListaPropiedades", {
        isLogged: req.session.isLoggedIn,
        idRol: req.session.idRol,
    });
};

/*
 * Llamada de query que regresa un json con los datos de los usuarios del sistema.
 */
exports.getUsers = async (req, res, next) => {
    const dataUsers = await Dashboard.fetchAllUsers();
    res.status(200).json({ code: 200, code: "Ok", data: dataUsers[0] });
}

/*
 * Llamada de query que regresa un json con los datos de las propiedades del sistema.
 */
exports.getPropiedades = async (req, res, next) => {
    const dataProps = await Dashboard.fetchAllPropiedades();
    res.status(200).json({ code: 200, code: "Ok", data: dataProps[0] });
}

// -- REGISTER A NEW USER FROM A ROLE ADMIN --//

exports.getAdminUser = (req, res, next) => {
    if (req.session.isLoggedIn == true) {
        isLogged = true;
        res.render("adminUserRegistration", {
            isLogged: req.session.isLoggedIn,
            idRol: req.session.idRol,
        });
    }
 }

/*
 * Llamada de query que actualiza el rol del usuario
 * @param id: String -> Id del usuario que será actualizado
 */
exports.updateRol = async(req, res, next) => {
    const id = req.params.id;
    await Dashboard.UpdateUserRol(id);
}


/*
 * Comprobación de trámites activos del usuario para posteriormente proceder a su eliminación
 * @param id: String -> Id del usuario que será checado y eliminado si es pertinente.
 */
exports.deleteUser = async (req, res, next) => {
    // Triple chequeo de posibles inmuebles, trámite de cliente y trámite de arrendador posibles en el usuario.
    const primeraComprobacion = await Dashboard.checkUser(req.params.id)
    const segundaComprobacion = await Dashboard.checkUser2(req.params.id)
    const terceraComprobacion = await Dashboard.checkUser3(req.params.id)
    tramites_activos = primeraComprobacion + segundaComprobacion + terceraComprobacion
    //Si los trámites activos son 0, eliminar usuario; si esto no es así, regresar un json que avise la existencia de procesos.
    if (tramites_activos == 0) {
        await Dashboard.DeleteUser(req.params.id);
    }
    else {
        res.status(200).json({
            isLogged: req.session.isLoggedIn,
            idRol: req.session.idRol,
            comprobacionEliminado: true
        });
    }

}

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