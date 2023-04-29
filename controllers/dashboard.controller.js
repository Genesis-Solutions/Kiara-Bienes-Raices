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

// -- MODIFY A PROPERTY AGENT OR ADMIN --//
exports.updateBodyCasa = (req,res,next) => {
    console.log("Entrando a la ruta update body casa");
    //Elementos obligatorios del formulario
    const {
        titulo,
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
    //Obtener el tipo de movimiento y los respectivos precios
    const venta = req.body.cocina ? 1 : 0;
    const renta = req.body.cisterna ? 1 : 0;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if(venta === 1 && renta === 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta;
        precioRenta = req.body.precioRenta;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta;
    }else if (venta === 0 && renta === 1) {
        tipoMovimiento = 2
        precioRenta = req.body.precioRenta;
    }
    //Obtener amenidades adicionales
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
    console.log(req.body);
    console.log("tipoMovimiento",tipoMovimiento);
    console.log("precioVenta",precioVenta);
    console.log("precioRenta",precioRenta);
    console.log("cocina",cocina);
    console.log("cisterna",cisterna);
    console.log("cuartoServicio",cuartoServicio);
    console.log("salaTV",salaTV);
    console.log("estudio",estudio);
    console.log("roofGarden",roofGarden);
    console.log("areaLavado",areaLavado);
    console.log("vigilancia",vigilancia);
    console.log("jardin",jardin);
    console.log("bodega",bodega);
    const idInmueble = req.params.inmueble;
    console.log("idInmueble",idInmueble);
    res.redirect("/dashboard/alta");
    Dashboard.changeInmuebleCasa(
        titulo,
        tipoMovimiento,
        linkVideo,
        precioVenta,
        precioRenta,
        m2terreno,
        m2construccion,
        niveles,
        mediosBanios,
        cuotaMantenimiento,
        fechaConstruccion,
        usoSuelo,
        ubicado,
        tipoGas,
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
    res.redirect('/dashboard/alta');
};

exports.updateBodyLocal = (req,res,next) => {
    console.log("Entrando a la ruta update body local");
    const {
        titulo,
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
        tipoGas,
        estacionamientos,
        banios,
        direccion,
        linkMaps,
        desc
    } = req.body;
    //Obtener el tipo de movimiento y los respectivos precios
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if(venta === 1 && renta === 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta;
        precioRenta = req.body.precioRenta;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta;
    }else if (venta === 0 && renta === 1) {
        tipoMovimiento = 2
        precioRenta = req.body.precioRenta;
    }
    const cocina = req.body.cocina ? 1 : 0;
    const cisterna = req.body.cisterna ? 1 : 0;
    const cuartoServicio = req.body.cuartoServicio ? 1 : 0;
    const vigilancia = req.body.vigilancia ? 1 : 0;
    const idInmueble = req.params.inmueble;
    console.log("idInmueble",idInmueble);
    res.redirect("/dashboard/alta");
    Dashboard.changeInmuebleLocal(
        titulo,
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
    res.redirect('/dashboard/alta');
};

exports.updateBodyTerreno = (req,res,next) => {
    console.log("Entrando a la ruta update body terreno");
    const {
        titulo,
        linkVideo,
        m2terreno,
        m2construccion,
        medidaFrente,
        medidaFondo,
        usoSuelo,
        ubicado,
        tipoSuelo,
        cuotaMantenimiento,
        direccion,
        linkMaps,
        desc
    } = req.body;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if(venta === 1 && renta === 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta;
        precioRenta = req.body.precioRenta;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta;
    }else if (venta === 0 && renta === 1) {
        tipoMovimiento = 2
        precioRenta = req.body.precioRenta;
    }
    const servicioAgua = req.body.servicioAgua ? 1 : 0;
    const servicioLuz = req.body.servicioLuz ? 1 : 0;
    const servicioDrenaje = req.body.servicioDrenaje ? 1 : 0;
    const vigilancia = req.body.vigilancia ? 1 : 0;
    const idInmueble = req.params.inmueble;
    console.log("idInmueble",idInmueble);
    res.redirect("/dashboard/alta");
    Dashboard.changeInmuebleTerreno(
        titulo,
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
    res.redirect('/dashboard/alta');
};

exports.updateBodyBodega = (req,res,next) => {
    console.log("Entrando a la ruta update body bodega");
    const {
        titulo,
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
        direccion,
        linkMaps,
        desc
    } = req.body;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if(venta === 1 && renta === 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta;
        precioRenta = req.body.precioRenta;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta;
    }else if (venta === 0 && renta === 1) {
        tipoMovimiento = 2
        precioRenta = req.body.precioRenta;
    }
    const cocina = req.body.cocina ? 1 : 0;
    const cisterna = req.body.cisterna ? 1 : 0;
    const vigilancia = req.body.vigilancia ? 1 : 0;
    const generadorElectrico = req.body.generadorElectrico ? 1 : 0;
    const andenCarga = req.body.andenCarga ? 1 : 0;
    const oficina = req.body.oficina ? 1 : 0;
    const patioManiobras = req.body.patioManiobras ? 1 : 0;
    const idInmueble = req.params.inmueble;
    console.log("idInmueble",idInmueble);
    res.redirect("/dashboard/alta");
    Dashboard.changeInmuebleBodega(
        titulo,
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
        banios,
        desc,
        direccion,
        linkMaps,
        idInmueble
    );
    res.redirect('/dashboard/alta');
};

exports.updateBodyOficina = (req,res,next) => {
    console.log("Entrando a la ruta update body oficina");
    const {
        titulo,
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
        direccion,
        linkMaps,
        desc
    } = req.body;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if(venta === 1 && renta === 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta;
        precioRenta = req.body.precioRenta;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta;
    }else if (venta === 0 && renta === 1) {
        tipoMovimiento = 2
        precioRenta = req.body.precioRenta;
    }
    const cocina = req.body.cocina ? 1 : 0;
    const cisterna = req.body.cisterna ? 1 : 0;
    const vigilancia = req.body.vigilancia ? 1 : 0;
    const idInmueble = req.params.inmueble;
    console.log("idInmueble",idInmueble);
    res.redirect("/dashboard/alta");
    Dashboard.changeInmuebleOficina(
        titulo,
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
        direccion,
        desc,
        linkMaps,
        idInmueble
    );
    res.redirect('/dashboard/alta');
};

exports.updateBodyOtra = (req,res,next) => {
    console.log("Entrando a la ruta update body otra");
    const {
        titulo,
        linkVideo,
        m2terreno,
        m2construccion,
        niveles,
        recamaras,
        cuartosPrivadosInmueble,
        mediosBanios,
        usoSuelo,
        ubicado,
        cuotaMantenimiento,
        estacionamientos,
        banios,
        direccion,
        linkMaps,
        desc
    } = req.body;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if(venta === 1 && renta === 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta;
        precioRenta = req.body.precioRenta;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta;
    }else if (venta === 0 && renta === 1) {
        tipoMovimiento = 2
        precioRenta = req.body.precioRenta;
    }
    const cocina = req.body.cocina ? 1 : 0;
    const cisterna = req.body.cisterna ? 1 : 0;
    const vigilancia = req.body.vigilancia ? 1 : 0;
    const idInmueble = req.params.inmueble;
    console.log("idInmueble",idInmueble);
    res.redirect("/dashboard/alta");
    Dashboard.changeInmuebleOtra(
        titulo,
        tipoMovimiento,
        linkVideo,
        precioVenta,
        precioRenta,
        m2terreno,
        m2construccion,
        niveles,
        recamaras,
        cuartosPrivadosInmueble,
        mediosBanios,
        usoSuelo,
        ubicado,
        cuotaMantenimiento,
        cocina,
        cisterna,
        vigilancia,
        estacionamientos,
        banios,
        desc,
        direccion,
        linkMaps,
        idInmueble
    );
    res.redirect('/dashboard/alta');
};
