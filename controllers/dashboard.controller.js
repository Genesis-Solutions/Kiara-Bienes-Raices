const Dashboard = require('../models/dashboard.model');
const { storage } = require('../util/awsMediaMulter.util');

/*
* Historia de usuario 1.5, 1.6 y 1.9 - Ver lista de usuarios, modificar rol y eliminar usuario.
* Controlador que maneja la lógica tras la llamada de las queriees de la lista de usuarios.
*/

/*
 * Renderización del dashboard tras realizar la validación de rol de usuario.
 */
exports.getDashboard = (req, res, next) => {
    // Renderizar la vista de la lista de Usuarios
    if (req.session.idRol == 1) {
        res.render("listUsers", {
            isLogged: req.session.isLoggedIn,
            idRol: req.session.idRol,
        });
    } else if (req.session.idRol == 2) {
        res.render("dashboardListaPropiedades", {
            isLogged: req.session.isLoggedIn,
            idRol: req.session.idRol,
        });
    }
};

/*
 * Renderización de la lista de propiedades
 */
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

/* 
 * Renderiza la vista de registro de usuario administrador si el usuario tiene sesión iniciada y es un usuario administrador.
 * @param req - La solicitud HTTP recibida.
 * @param res - La respuesta HTTP que se enviará.
 * @param next - La función middleware para pasar el control al siguiente middleware.
 * @returns {Promise<void>} - Una promesa que se resuelve cuando se completa el renderizado de la vista de registro de usuario administrador.
 */

exports.getAdminUser = async (req, res, next) => {
    /*
    *Obtiene la lista de roles a través de un método asíncrono del modelo Dashboard.
    */
    const listRoles = await Dashboard.fetchAllRoles();
    /*
    *Si el usuario tiene sesión iniciada, la variable isLogged se establece como verdadera y
    *se renderiza la vista de registro de usuario administrador con los parámetros proporcionados.
    */
    if (req.session.isLoggedIn == true) {
        isLogged = true;
        res.render("adminUserRegistration", {
            isLogged: req.session.isLoggedIn,
            idRol: req.session.idRol,
            listRoles: listRoles[0]
        });
    }
}

/*
 * Llamada de query que actualiza el rol del usuario
 * @param id: String -> Id del usuario que será actualizado
 */
exports.updateRol = async (req, res, next) => {
    await Dashboard.updateUserRol(req.params.idUsuario, req.params.idRol);
}

/*
 * Llamada de query que actualiza el encargado de la propiedad
 * @param idAgente: String -> Id del nuevo encargado de la propiedad 
 * @param idPropiedad: String -> Id de la propiedad a modificar
 */
exports.updateEncargado = async (req, res, next) => {
    await Dashboard.updateEncargadoPropiedad(req.params.idAgente, req.params.idPropiedad);
}

/*
 * Comprobación de trámites activos del usuario para posteriormente proceder a su eliminación
 * @param id: String -> Id del usuario que será checado y eliminado si es pertinente.
 */
exports.deleteUser = async (req, res, next) => {
    /*
    * Triple chequeo de posibles inmuebles, trámite de cliente y trámite de arrendador posibles en el usuario.
    */
    const primeraComprobacion = await Dashboard.checkUser(req.params.id)
    const segundaComprobacion = await Dashboard.checkUser2(req.params.id)
    const terceraComprobacion = await Dashboard.checkUser3(req.params.id)
    tramites_activos = primeraComprobacion + segundaComprobacion + terceraComprobacion
    /*
    * Si los trámites activos son 0, eliminar usuario; si esto no es así, regresar un json que avise la existencia de procesos.
    */
    if (tramites_activos == 0) {
        await Dashboard.deleteUser(req.params.id);
        res.status(200).json({
            isLogged: req.session.isLoggedIn,
            idRol: req.session.idRol,
            comprobacionEliminado: true
        });
    } else {
        res.status(200).json({
            isLogged: req.session.isLoggedIn,
            idRol: req.session.idRol,
            comprobacionEliminado: false
        });
    }
}

/*
 * Comprobación de trámites activos del usuario para posteriormente proceder a su cambio de rol
 * @param idUsuario: String -> Id del usuario que será checado y su rol cambiado si es pertinente.
 * @param idRol: String -> Rol del usuario que posteriormente será aplicado
 */
exports.comprobarUpdateRol = async (req, res, next) => {
    /*
    * Triple chequeo de posibles inmuebles, trámite de cliente y trámite de arrendador posibles en el usuario.
    */
    const primeraComprobacion = await Dashboard.checkUser(req.params.idUsuario);
    const segundaComprobacion = await Dashboard.checkUser2(req.params.idUsuario);
    const terceraComprobacion = await Dashboard.checkUser3(req.params.idUsuario);
    tramites_activos = primeraComprobacion + segundaComprobacion + terceraComprobacion;
    /*
    * Si los trámites activos son 0, cambiar rol de usuario; si esto no es así, regresar un json que avise la existencia de procesos.
    */
    if (tramites_activos == 0) {
        await Dashboard.updateUserRol(req.params.idUsuario, req.params.idRol);
        res.status(200).json({
            isLogged: req.session.isLoggedIn,
            idRol: req.session.idRol,
            comprobacionCambio: true
        });
    }
    else {
        res.status(200).json({
            isLogged: req.session.isLoggedIn,
            idRol: req.session.idRol,
            comprobacionCambio: false
        });
    }

}


/*
Retorna un array con los agentes registrados en el sistema.
@param {Object} req - Objeto de solicitud de Express.
@param {Object} res - Objeto de respuesta de Express.
@param {function} next - Función de middleware para pasar el control al siguiente controlador.
@returns {Object} - Objeto JSON con los agentes registrados y los estados de inicio de sesión e ID de rol.
@throws {Error} - Error de servidor.
*/
exports.getAgentes = async (req, res, next) => {
    const agentesArray = await Dashboard.getAgentes();
        res.status(200).json({
            isLogged: req.session.isLoggedIn,
            idRol: req.session.idRol,
            agentesArray: agentesArray
        });
}

exports.postAdminUser = async (req, res, next) => {
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
    const listRoles = await Dashboard.fetchAllRoles();

   
    
    /*
    * Convertir los valores numericos a string
    */
    telefonoUsuarioString = telefonoUsuario.toString();
    activoUsuarioString = activoUsuario.toString();
    idRolString = rolUsuario.toString();
    idFotoString = idFoto.toString();
    /*
    * Revisar que el correo no esté registrado
    */
    Dashboard.findOne(emailUsuario)
        .then(async ([rows, data]) => {
            if (rows.length >= 1) {
                //console.log("El correo electrónico ingresado ya está registrado.");
                const errorEmail = "El correo electrónico ingresado ya está registrado";
                if (req.session.isLoggedIn == true) {
                    isLogged = true;
                    res.render("adminUserRegistration", {
                        isLogged: req.session.isLoggedIn,
                        idRol: req.session.idRol,
                        errorEmail,
                        listRoles: listRoles[0]
                    });
                }
            } else {
                if (passwordUsuario == passwordUsuarioConfirmar) {
                    //console.log("Las contraseñas coinciden.");
                    /* 
                    * Si todo fue validado correctamente, se inserta el usuario en la base de datos
                    */
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
                            listRoles: listRoles[0]
                        });
                    }
                }
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

/*
* Historia de usuario 2.1 - Publicar inmueble.
* Controlador que maneja la lógica tras el registro nuevos inmuebles de distintas categorías.
*/

/*
Renderiza la vista del registro de un nuevo inmueble en el sistema.
@param {object} req - Objeto de solicitud de Express.
@param {object} res - Objeto de respuesta de Express.
@param {function} next - Función que llama al siguiente controlador en la cadena.
@throws {Error} Si no se puede acceder a la página debido a permisos insuficientes.
Esta función comprueba si el usuario tiene permisos de administrador para acceder a la página de registro de un nuevo inmueble.
Si el usuario tiene los permisos necesarios, muestra la página de registro de un nuevo inmueble con una lista de todas las categorías disponibles.
*/
exports.getRegisterpage = async (req, res, next) => {
    //Revisar que tenga el rol de administrador
    if (req.session.idRol != 1 && req.session.idRol != 2) {
        return res.status(403).send("No tiene autorizado acceder a esta página")
    }
    // Renderizar la vista del panel de administrador
    if (req.session.isLoggedIn == true) {
        isLogged = true;
        const categorias = await Dashboard.fetchAllCategories();
        res.render('altaInmueble', {
            categorias: categorias[0],
            isLogged: req.session.isLoggedIn,
            idRol: req.session.idRol
        });
    }
}

/*
Renderiza la vista del formulario de alta de un inmueble con una categoría específica.
Verifica que el usuario tenga el rol de administrador o agente.
@param {Object} req - Objeto de solicitud de Express.
@param {Object} res - Objeto de respuesta de Express.
@param {function} next - Función que llama al siguiente middleware.
@throws {Error} Si el usuario no tiene autorización para acceder a la página.
@returns {void}
*/
exports.getCategoria = async (req, res, next) => {
    //Revisar que tenga el rol de administrador
    if (req.session.idRol != 1 && req.session.idRol != 2) {
        return res.status(403).send("No tiene autorizado acceder a esta página")
    }
    // Renderizar la vista del panel de administrador
    if (req.session.isLoggedIn == true) {
        isLogged = true;
        const idCategoria = req.params.categoria;
        const idUsuario = req.session.idUsuario;
        //console.log("Categoria del inmueble creado",idCategoria);
        //console.log("Id del usuario",idCategoria);
        const inmueble = await Dashboard.insertDisabledRegister(idCategoria.toString(), idUsuario.toString());
        const idInmueble = await Dashboard.getLastDisabledRegisterID();
        //console.log("Id del inmueble recien generado",idInmueble[0][0].idInmueble);
        const listaAgentes = await Dashboard.fetchAgents();
        //console.log("Lista de todos los agentes",listaAgentes[0]);
        const listaClientes = await Dashboard.fetchClients();
        //console.log("Lista de todos los agentes",listaClientes[0]);
        const listaTipoMovimientos = await Dashboard.fetchAllMovements();
        //console.log("Lista de todos los tipos de movimiento",listaTipoMovimientos[0]);
        res.render('formularioAltaInmueble', {
            isLogged: isLogged,
            idRol: req.session.idRol,
            idInmueble: idInmueble[0][0].idInmueble,
            categoria: idCategoria,
            listaAgentes: listaAgentes[0],
            listaClientes: listaClientes[0],
            listaTipoMovimientos: listaTipoMovimientos[0],
            idUsuario: idUsuario
        });
    }
};

/*
Elimina un inmueble del dashboard por su ID.
@param {Object} req - Objeto de solicitud de Express con el parámetro "idInmueble".
@param {Object} res - Objeto de respuesta de Express.
@param {Function} next - Función de middleware para pasar el control al siguiente manejador.
@returns {Object} - Objeto JSON con el código de estado 200 y mensaje "Ok" si la operación fue exitosa.
@throws {Error} - Error de base de datos si no se puede eliminar el inmueble.
*/
exports.deleteInmueble = (req, res, next) => {
    const idInmueble = req.params.idInmueble;
    Dashboard.deleteInmuebleById(idInmueble)
        .then(([rows, fieldData]) => {
            res.status(200).json({ code: 200, msg: "Ok" });
        })
        .catch(error => { console.log(error) });
};

/*
Agrega una o varias fotos al inmueble especificado en la solicitud HTTP.
@param {Object} req - Objeto de solicitud de Express.
@param {Object} res - Objeto de respuesta de Express.
@param {Function} next - Función de middleware para pasar el control al siguiente manejador.
@returns {Object} - Objeto JSON con el código de estado 200 y mensaje "Ok" si la operación fue exitosa.
@throws {Error} - Error de base de datos si no se puede registrar la imagen del inmueble.
*/
exports.setPhotos = (req, res, next) => {
    var upload = storage.array('media', 25);
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
        } else {
            req.files.forEach(function (file) {
                const idInmueble = req.params.inmueble;
                const mediaName = file.key;
                Dashboard.registerImage(idInmueble, mediaName);
            });
        }
    });
    res.status(200).json({ code: 200, msg: "Ok" });
};

/*
Actualiza los datos de un inmueble de tipo "Casa" o "Departamento" en el dashboard.
Los inmuebles de tipo "Casa" y "Departamento" almacenan los mismos datos.
@param {Object} req - Objeto de solicitud de Express.
@param {Object} res - Objeto de respuesta de Express.
@param {Function} next - Función de middleware para pasar el control al siguiente manejador.
@returns {Object} - Objeto JSON con el código de estado 200 y mensaje "Ok" si la operación fue exitosa.
@throws {Error} - Error de base de datos si no se puede actualizar el inmueble.
*/
exports.updateBodyCasa = (req, res, next) => {
    //console.log("Entrando a la ruta update body casa");
    /*
    *Elementos obligatorios del formulario
    */
    const {
        titulo,
        id_agente,
        id_arrendador,
        linkVideo,
        m2terreno,
        niveles,
        mediosBanios,
        cuotaMantenimiento,
        fechaConstruccion,
        usoSuelo,
        ubicado,
        tipoGas,
        m2construccion,
        recamaras,
        estacionamientos,
        banios,
        desc,
        direccion,
        linkMaps
    } = req.body;
    /*
    *Obtener el tipo de movimiento y los respectivos precios.
    */
    const venta = req.body.venta ? 1 : 0;
    const renta = req.body.renta ? 1 : 0;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if (venta === 1 && renta === 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = 0;
    } else if (venta === 0 && renta === 1) {
        tipoMovimiento = 2
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
        precioVenta = 0;
    }
    /*
    *Obtener amenidades adicionales
    */
    const cocina = req.body.cocina ? 1 : 0;
    const cisterna = req.body.cisterna ? 1 : 0;
    const cuartoServicio = req.body.cuartoServicio ? 1 : 0;
    const salaTV = req.body.salaTV ? 1 : 0;
    const estudio = req.body.estudio ? 1 : 0;
    const roofGarden = req.body.roofGarden ? 1 : 0;
    const areaLavado = req.body.areaLavado ? 1 : 0;
    const vigilancia = req.body.vigilancia ? 1 : 0;
    const jardin = req.body.jardin ? 1 : 0;
    const bodega = req.body.bodega ? 1 : 0;
    const idInmueble = req.params.inmueble;
    //console.log("idInmueble",idInmueble);
    Dashboard.activateInmuebleCasa(
        titulo,
        id_agente,
        id_arrendador,
        tipoMovimiento,
        linkVideo,
        precioVenta,
        precioRenta,
        m2terreno,
        niveles,
        mediosBanios,
        cuotaMantenimiento,
        fechaConstruccion,
        usoSuelo,
        ubicado,
        tipoGas,
        m2construccion,
        recamaras,
        estacionamientos,
        banios,
        desc,
        cocina,
        cisterna,
        cuartoServicio,
        salaTV,
        estudio,
        roofGarden,
        areaLavado,
        vigilancia,
        jardin,
        bodega,
        direccion,
        linkMaps,
        idInmueble
    );
    res.status(200).json({ code: 200, msg: "Ok" });
};

/*
Actualiza los datos de un inmueble de tipo "Local" en el dashboard.
@param {Object} req - Objeto de solicitud de Express.
@param {Object} res - Objeto de respuesta de Express.
@param {Function} next - Función de middleware para pasar el control al siguiente manejador.
@returns {Object} - Objeto JSON con el código de estado 200 y mensaje "Ok" si la operación fue exitosa.
@throws {Error} - Error de base de datos si no se puede actualizar el inmueble.
*/
exports.updateBodyLocal = (req, res, next) => {
    //console.log("Entrando a la ruta update body local");
    const {
        titulo,
        id_agente,
        id_arrendador,
        linkVideo,
        m2terreno,
        medidaFrente,
        medidaFondo,
        niveles,
        cuartosPrivadosInmueble,
        mediosBanios,
        cuotaMantenimiento,
        fechaConstruccion,
        usoSuelo,
        ubicado,
        tipoGas,
        m2construccion,
        estacionamientos,
        banios,
        desc,
        direccion,
        linkMaps
    } = req.body;
    console.log(req.body);
    /*
    *Obtener el tipo de movimiento y los respectivos precios
    */
    const venta = req.body.venta ? 1 : 0;
    const renta = req.body.renta ? 1 : 0;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if (venta === 1 && renta === 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = 0;
    } else if (venta === 0 && renta === 1) {
        tipoMovimiento = 2
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
        precioVenta = 0;
    }
    const cocina = req.body.cocina ? 1 : 0;
    const cisterna = req.body.cisterna ? 1 : 0;
    const cuartoServicio = req.body.cuartoServicio ? 1 : 0;
    const vigilancia = req.body.vigilancia ? 1 : 0;
    const idInmueble = req.params.inmueble;
    //console.log("idInmueble",idInmueble);
    Dashboard.activateInmuebleLocal(
        titulo,
        id_agente,
        id_arrendador,
        tipoMovimiento,
        linkVideo,
        precioVenta,
        precioRenta,
        m2terreno,
        m2construccion,
        medidaFrente,
        medidaFondo,
        niveles,
        cuartosPrivadosInmueble,
        mediosBanios,
        estacionamientos,
        usoSuelo,
        ubicado,
        cuotaMantenimiento,
        cocina,
        cisterna,
        cuartoServicio,
        fechaConstruccion,
        vigilancia,
        tipoGas,
        estacionamientos,
        banios,
        desc,
        direccion,
        linkMaps,
        idInmueble
    );
    res.status(200).json({ code: 200, msg: "Ok" })
};

/*
Actualiza los datos de un inmueble de tipo "Terreno" en el dashboard.
@param {Object} req - Objeto de solicitud de Express.
@param {Object} res - Objeto de respuesta de Express.
@param {Function} next - Función de middleware para pasar el control al siguiente manejador.
@returns {Object} - Objeto JSON con el código de estado 200 y mensaje "Ok" si la operación fue exitosa.
@throws {Error} - Error de base de datos si no se puede actualizar el inmueble.
*/
exports.updateBodyTerreno = (req, res, next) => {
    //console.log("Entrando a la ruta update body terreno");
    const {
        titulo,
        id_agente,
        id_arrendador,
        linkVideo,
        m2terreno,
        m2construccion,
        medidaFrente,
        medidaFondo,
        usoSuelo,
        ubicado,
        tipoSuelo,
        cuotaMantenimiento,
        desc
    } = req.body;
    /*
    *Obtener el tipo de movimiento y los respectivos precios
    */
    const venta = req.body.venta ? 1 : 0;
    const renta = req.body.renta ? 1 : 0;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if (venta === 1 && renta === 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = 0;
    } else if (venta === 0 && renta === 1) {
        tipoMovimiento = 2
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
        precioVenta = 0;
    }
    const servicioAgua = req.body.servicioAgua ? 1 : 0;
    const servicioLuz = req.body.servicioLuz ? 1 : 0;
    const servicioDrenaje = req.body.servicioDrenaje ? 1 : 0;
    const vigilancia = req.body.vigilancia ? 1 : 0;
    const idInmueble = req.params.inmueble;
    //console.log("idInmueble",idInmueble);
    Dashboard.activateInmuebleTerreno(
        titulo,
        id_agente,
        id_arrendador,
        tipoMovimiento,
        linkVideo,
        precioVenta,
        precioRenta,
        m2terreno,
        m2construccion,
        medidaFrente,
        medidaFondo,
        usoSuelo,
        ubicado,
        servicioAgua,
        servicioLuz,
        servicioDrenaje,
        tipoSuelo,
        cuotaMantenimiento,
        vigilancia,
        desc,
        direccion,
        linkMaps,
        idInmueble
    );
    res.status(200).json({ code: 200, msg: "Ok" })
};

/*
Actualiza los datos de un inmueble de tipo "Bodega" en el dashboard.
@param {Object} req - Objeto de solicitud de Express.
@param {Object} res - Objeto de respuesta de Express.
@param {Function} next - Función de middleware para pasar el control al siguiente manejador.
@returns {Object} - Objeto JSON con el código de estado 200 y mensaje "Ok" si la operación fue exitosa.
@throws {Error} - Error de base de datos si no se puede actualizar el inmueble.
*/
exports.updateBodyBodega = (req, res, next) => {
    //console.log("Entrando a la ruta update body bodega");
    const {
        titulo,
        id_agente,
        id_arrendador,
        linkVideo,
        m2terreno,
        m2construccion,
        medidaFrente,
        medidaFondo,
        niveles,
        cuartosPrivadosInmueble,
        mediosBanios,
        usoSuelo,
        ubicado,
        cuotaMantenimiento,
        fechaConstruccion,
        muros,
        altura,
        tipoPiso,
        tipoLuz,
        estacionamientos,
        banios,
        desc
    } = req.body;
    /*
    *Obtener el tipo de movimiento y los respectivos precios
    */
    const venta = req.body.venta ? 1 : 0;
    const renta = req.body.renta ? 1 : 0;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if (venta === 1 && renta === 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = 0;
    } else if (venta === 0 && renta === 1) {
        tipoMovimiento = 2
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
        precioVenta = 0;
    }
    const cocina = req.body.cocina ? 1 : 0;
    const cisterna = req.body.cisterna ? 1 : 0;
    const vigilancia = req.body.vigilancia ? 1 : 0;
    const generadorElectrico = req.body.generadorElectrico ? 1 : 0;
    const andenCarga = req.body.andenCarga ? 1 : 0;
    const oficina = req.body.oficina ? 1 : 0;
    const patioManiobras = req.body.patioManiobras ? 1 : 0;
    const idInmueble = req.params.inmueble;
    //console.log("idInmueble",idInmueble);
    Dashboard.activateInmuebleBodega(
        titulo,
        id_agente,
        id_arrendador,
        tipoMovimiento,
        linkVideo,
        precioVenta,
        precioRenta,
        m2terreno,
        m2construccion,
        medidaFrente,
        medidaFondo,
        niveles,
        cuartosPrivadosInmueble,
        mediosBanios,
        estacionamientos,
        usoSuelo,
        ubicado,
        cuotaMantenimiento,
        cocina,
        cisterna,
        fechaConstruccion,
        vigilancia,
        generadorElectrico,
        andenCarga,
        oficina,
        patioManiobras,
        muros,
        altura,
        tipoPiso,
        tipoLuz,
        estacionamientos,
        banios,
        desc,
        direccion,
        linkMaps,
        idInmueble
    );
    res.status(200).json({ code: 200, msg: "Ok" })
};

/*
Actualiza los datos de un inmueble de tipo "Oficina" en el dashboard.
@param {Object} req - Objeto de solicitud de Express.
@param {Object} res - Objeto de respuesta de Express.
@param {Function} next - Función de middleware para pasar el control al siguiente manejador.
@returns {Object} - Objeto JSON con el código de estado 200 y mensaje "Ok" si la operación fue exitosa.
@throws {Error} - Error de base de datos si no se puede actualizar el inmueble.
*/
exports.updateBodyOficina = (req, res, next) => {
    //console.log("Entrando a la ruta update body oficina");
    const {
        titulo,
        id_agente,
        id_arrendador,
        linkVideo,
        m2terreno,
        m2construccion,
        niveles,
        cuartosPrivadosInmueble,
        mediosBanios,
        usoSuelo,
        ubicado,
        cuotaMantenimiento,
        fechaConstruccion,
        estacionamientos,
        banios,
        desc
    } = req.body;
    /*
    *Obtener el tipo de movimiento y los respectivos precios
    */
    const venta = req.body.venta ? 1 : 0;
    const renta = req.body.renta ? 1 : 0;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if (venta === 1 && renta === 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = 0;
    } else if (venta === 0 && renta === 1) {
        tipoMovimiento = 2
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
        precioVenta = 0;
    }
    const cocina = req.body.cocina ? 1 : 0;
    const cisterna = req.body.cisterna ? 1 : 0;
    const vigilancia = req.body.vigilancia ? 1 : 0;
    const idInmueble = req.params.inmueble;
    //console.log("idInmueble",idInmueble);
    Dashboard.activateInmuebleOficina(
        titulo,
        id_agente,
        id_arrendador,
        tipoMovimiento,
        linkVideo,
        precioVenta,
        precioRenta,
        m2terreno,
        m2construccion,
        niveles,
        cuartosPrivadosInmueble,
        mediosBanios,
        usoSuelo,
        ubicado,
        cuotaMantenimiento,
        cocina,
        cisterna,
        fechaConstruccion,
        vigilancia,
        estacionamientos,
        banios,
        desc,
        direccion,
        linkMaps,
        idInmueble
    );
    res.status(200).json({ code: 200, msg: "Ok" })
};


/*
Actualiza los datos de un inmueble de tipo "Otro" en el dashboard.
@param {Object} req - Objeto de solicitud de Express.
@param {Object} res - Objeto de respuesta de Express.
@param {Function} next - Función de middleware para pasar el control al siguiente manejador.
@returns {Object} - Objeto JSON con el código de estado 200 y mensaje "Ok" si la operación fue exitosa.
@throws {Error} - Error de base de datos si no se puede actualizar el inmueble.
*/
exports.updateBodyOtro = (req, res, next) => {
    //console.log("Entrando a la ruta update body otro");
    const {
        titulo,
        id_agente,
        id_arrendador,
        linkVideo,
        m2terreno,
        m2construccion,
        niveles,
        numRecamaras,
        cuartosPrivados,
        mediosBanios,
        usoSuelo,
        ubicado,
        cuotaMantenimiento,
        estacionamientos,
        banios,
        desc,
        direccion,
        linkMaps
    } = req.body;
    /*
    *Obtener el tipo de movimiento y los respectivos precios
    */
    const venta = req.body.venta ? 1 : 0;
    const renta = req.body.renta ? 1 : 0;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if (venta === 1 && renta === 1) {
        tipoMovimiento = 3;
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1;
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = 0;
    } else if (venta === 0 && renta === 1) {
        tipoMovimiento = 2;
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
        precioVenta = 0;
    }
    const cocina = req.body.cocina ? 1 : 0;
    const cisterna = req.body.cisterna ? 1 : 0;
    const vigilancia = req.body.vigilancia ? 1 : 0;
    const idInmueble = req.params.inmueble;
    //console.log("idInmueble",idInmueble);
    Dashboard.activateInmuebleOtro(
        titulo,
        id_agente,
        id_arrendador,
        linkVideo,
        tipoMovimiento,
        precioVenta,
        precioRenta,
        m2terreno,
        m2construccion,
        niveles,
        numRecamaras,
        cuartosPrivados,
        mediosBanios,
        usoSuelo,
        ubicado,
        cuotaMantenimiento,
        estacionamientos,
        banios,
        desc,
        direccion,
        cocina,
        cisterna,
        vigilancia,
        linkMaps,
        idInmueble
    );
    res.status(200).json({ code: 200, msg: "Ok" })
};
