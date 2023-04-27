const path = require('path');
const Dashboard = require('../models/dashboard.model');
const { storage } = require('../util/awsMediaMulter');

// -- LIST USERS -- //
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
    if (req.session.idRol != 1) {
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
    if (req.session.idRol != 1) {
        return res.status(403).send("No tiene autorizado acceder a esta página")
    }
    // Renderizar la vista del panel de administrador
    if (req.session.isLoggedIn == true) {
        isLogged = true;
        const idCategoria = req.params.categoria;
        const idUsuario = req.session.idUsuario;
        console.log("Categoria del inmueble creado",idCategoria);
        console.log("Id del usuario",idCategoria);
        const inmueble = await Dashboard.insertDisabledRegister(idCategoria.toString(),idUsuario.toString());
        const idInmueble = await Dashboard.getLastDisabledRegisterID();
        console.log("Id del inmueble recien generado",idInmueble[0][0].idInmueble);
        const listaAgentes = await Dashboard.fetchAgents();
        console.log("Lista de todos los agentes",listaAgentes[0]);
        const listaTipoMovimientos = await Dashboard.fetchAllMovements();
        console.log("Lista de todos los tipos de movimiento",listaTipoMovimientos[0]);
        res.render('formularioAltaInmueble', {
            isLogged: isLogged,
            idRol: req.session.idRol,
            idInmueble: idInmueble[0][0].idInmueble,
            categoria: idCategoria,
            listaAgentes: listaAgentes[0],
            listaTipoMovimientos: listaTipoMovimientos[0]
        });
    } 
};

exports.setMainPhoto = (req,res,next) => {
    console.log("Entrando a la ruta de imagen principal");
    var upload = storage.array('mainPhoto',1);
    upload(req,res,function(err) {
        //console.log(req.body);
        //console.log(req.files);
        if(err) {
            console.log(err)
            return res.end("Error uploading file.");
        }
        const idInmueble = req.params.inmueble;
        const mediaName = req.files[0].key;
        Dashboard.insertPhoto(mediaName)
            .then(([rows, fieldData]) => {
                Dashboard.getLastPhotoId()
                    .then(([rows2, fieldData]) => {
                        console.log("FotoInmueble - idInmueble: ",idInmueble);
                        console.log("FotoInmueble - idFoto: ",rows2[0].idFoto);
                        Dashboard.insertFotoInmueble(idInmueble,rows2[0].idFoto);
                    })
                    .catch(error => { console.log(error) });
            })
            .catch(error => { console.log(error) });
        res.status(200).json({code: 200, msg:"Ok"})
    })
};

exports.updateBodyCasa = (req,res,next) => {
    console.log("Entrando a la ruta update body casa");
    // const {
    //     name,
    //     desc,
    //     tipoMovimiento,
    //     precio,
    // } = req.body;
    console.log(req.body);
    const idInmueble = req.params.inmueble;
    console.log("idInmueble",idInmueble);
    // Dashboard.activateInmuebleCasa(name,desc,tipoMovimiento,precio,idInmueble)
    //     .then(() => {
    //         res.redirect("/dashboard/alta");
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });
};