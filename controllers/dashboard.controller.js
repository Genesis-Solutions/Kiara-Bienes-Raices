const path = require('path');
const Dashboard = require('../models/dashboard.model');
const { storage } = require('../util/awsMediaMulter');

exports.getDashboard = (req, res, next) => {
    //Revisar que tenga el rol de administrador
    if (req.session.idRol != 1) {
        return res.status(403).send("No tiene autorizado acceder a esta página")
    }
    // Renderizar la vista de registro
    if (req.session.isLoggedIn == true) {
        isLogged = true;
        res.render('listUsers', {
            isLogged: req.session.isLoggedIn,
            idRol: req.session.idRol
        });
    } 
}

exports.getUsers = async(req, res, next) => {
    const dataUsers = await Dashboard.fetchAllUsers();
    res.status(200).json({code: 200, code: "Ok", data: dataUsers[0]});
}

exports.getRegisterpage = async(req, res, next) => {
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

exports.getCategoria = async(req,res,next) => {
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
        const inmueble = await Dashboard.insertDisabledRegister(idCategoria.toString(),idUsuario.toString());
        const idInmueble = await Dashboard.getLastDisabledRegisterID();
        //console.log("Id del inmueble recien generado",idInmueble[0][0].idInmueble);
        const listaAgentes = await Dashboard.fetchAgents();
        //console.log("Lista de todos los agentes",listaAgentes[0]);
        const listaTipoMovimientos = await Dashboard.fetchAllMovements();
        //console.log("Lista de todos los tipos de movimiento",listaTipoMovimientos[0]);
        res.render('formularioAltaInmueble', {
            isLogged: isLogged,
            idRol: req.session.idRol,
            idInmueble: idInmueble[0][0].idInmueble,
            categoria: idCategoria,
            listaAgentes: listaAgentes[0],
            listaTipoMovimientos: listaTipoMovimientos[0],
            idUsuario: idUsuario
        });
    } 
};

exports.deleteInmueble = (req,res,next) => {
    const idInmueble = req.params.idInmueble;
    Dashboard.deleteInmuebleById(idInmueble)
        .then(([rows, fieldData]) => {
            res.status(200).json({code: 200, msg:"Ok"});
        })
        .catch(error => { console.log(error) });
};

exports.setPhotos = (req,res,next) => {
    var upload = storage.array('media',25);
    upload(req, res, function(err) {
        if (err) {
            console.log(err);
        } else {
            req.files.forEach(function(file) {
                const idInmueble = req.params.inmueble;
                const mediaName = file.key;
                Dashboard.registerImage(idInmueble,mediaName);
            });
        }
    });
    res.status(200).json({code: 200, msg:"Ok"});
};

exports.updateBodyCasa = (req,res,next) => {
    console.log("Entrando a la ruta update body casa");
    //Elementos obligatorios del formulario
    const {
        titulo,
        id_agente,
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
    const venta = req.body.venta ? 1 : 0;
    const renta = req.body.renta ? 1 : 0;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if(venta === 1 && renta === 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = 0;
    }else if (venta === 0 && renta === 1) {
        tipoMovimiento = 2
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
        precioVenta = 0;
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
    Dashboard.activateInmuebleCasa(
        titulo,
        id_agente,
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
    res.status(200).json({code: 200, msg:"Ok"});
};

exports.updateBodyLocal = (req,res,next) => {
    console.log("Entrando a la ruta update body local");
    const {
        titulo,
        id_agente,
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
        desc
    } = req.body;
    //Obtener el tipo de movimiento y los respectivos precios
    const venta = req.body.venta ? 1 : 0;
    const renta = req.body.renta ? 1 : 0;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if(venta === 1 && renta === 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = 0;
    }else if (venta === 0 && renta === 1) {
        tipoMovimiento = 2
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
        precioVenta = 0;
    }
    const cocina = req.body.cocina ? 1 : 0;
    const cisterna = req.body.cisterna ? 1 : 0;
    const cuartoServicio = req.body.cuartoServicio ? 1 : 0;
    const vigilancia = req.body.vigilancia ? 1 : 0;
    const idInmueble = req.params.inmueble;
    console.log("idInmueble",idInmueble);
    Dashboard.activateInmuebleLocal(
        titulo,
        id_agente,
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
    res.status(200).json({code: 200, msg:"Ok"})
};

exports.updateBodyTerreno = (req,res,next) => {
    console.log("Entrando a la ruta update body terreno");
    const {
        titulo,
        id_agente,
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
    //Obtener el tipo de movimiento y los respectivos precios
    const venta = req.body.venta ? 1 : 0;
    const renta = req.body.renta ? 1 : 0;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if(venta === 1 && renta === 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = 0;
    }else if (venta === 0 && renta === 1) {
        tipoMovimiento = 2
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
        precioVenta = 0;
    }
    const servicioAgua = req.body.servicioAgua ? 1 : 0;
    const servicioLuz = req.body.servicioLuz ? 1 : 0;
    const servicioDrenaje = req.body.servicioDrenaje ? 1 : 0;
    const vigilancia = req.body.vigilancia ? 1 : 0;
    const idInmueble = req.params.inmueble;
    console.log("idInmueble",idInmueble);
    Dashboard.activateInmuebleTerreno(
        titulo,
        id_agente,
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
    res.status(200).json({code: 200, msg:"Ok"})
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
        desc
    } = req.body;
    //Obtener el tipo de movimiento y los respectivos precios
    const venta = req.body.venta ? 1 : 0;
    const renta = req.body.renta ? 1 : 0;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if(venta === 1 && renta === 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = 0;
    }else if (venta === 0 && renta === 1) {
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
    console.log("idInmueble",idInmueble);
    Dashboard.activateInmuebleBodega(
        titulo,
        id_agente,
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
    res.status(200).json({code: 200, msg:"Ok"})
};

exports.updateBodyOficina = (req,res,next) => {
    console.log("Entrando a la ruta update body oficina");
    const {
        titulo,
        id_agente,
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
    //Obtener el tipo de movimiento y los respectivos precios
    const venta = req.body.venta ? 1 : 0;
    const renta = req.body.renta ? 1 : 0;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if(venta === 1 && renta === 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = 0;
    }else if (venta === 0 && renta === 1) {
        tipoMovimiento = 2
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
        precioVenta = 0;
    }
    const cocina = req.body.cocina ? 1 : 0;
    const cisterna = req.body.cisterna ? 1 : 0;
    const vigilancia = req.body.vigilancia ? 1 : 0;
    const idInmueble = req.params.inmueble;
    console.log("idInmueble",idInmueble);
    Dashboard.activateInmuebleOficina(
        titulo,
        id_agente,
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
    res.status(200).json({code: 200, msg:"Ok"})
};

exports.updateBodyOtro = (req,res,next) => {
    console.log("Entrando a la ruta update body otro");
    const {
        titulo,
        id_agente,
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
    //Obtener el tipo de movimiento y los respectivos precios
    const venta = req.body.venta ? 1 : 0;
    const renta = req.body.renta ? 1 : 0;
    let tipoMovimiento = 0;
    let precioVenta = 0;
    let precioRenta = 0;
    if(venta === 1 && renta === 1) {
        tipoMovimiento = 3
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
    } else if (venta === 1 && renta === 0) {
        tipoMovimiento = 1
        precioVenta = req.body.precioVenta ? req.body.precioVenta : 0;
        precioRenta = 0;
    }else if (venta === 0 && renta === 1) {
        tipoMovimiento = 2
        precioRenta = req.body.precioRenta ? req.body.precioRenta : 0;
        precioVenta = 0;
    }
    const cocina = req.body.cocina ? 1 : 0;
    const cisterna = req.body.cisterna ? 1 : 0;
    const vigilancia = req.body.vigilancia ? 1 : 0;
    const idInmueble = req.params.inmueble;
    console.log("idInmueble",idInmueble);
    Dashboard.activateInmuebleOtro(
        titulo,
        id_agente,
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
    res.status(200).json({code: 200, msg:"Ok"})
};