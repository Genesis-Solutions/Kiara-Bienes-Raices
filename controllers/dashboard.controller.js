/*
* Historia de usuario 1.5, 1.6 y 1.9 - Ver lista de usuarios, modificar rol y eliminar usuario.
* Controlador que maneja la lógica tras la llamada de las queriees de la lista de usuarios.
*/
const path = require('path');
const User = require('../models/dashboard.model');
const Dashboard = require('../models/dashboard.model');
const { info } = require('console');

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
            idRol: req.session.idRol,
        });
    } 
}
// Tomar el id del usuario y el id del rol, concatenados dentro del parámetro, y enviarlos a la query de actualización.
exports.updateRol = async(req, res, next) => {
    const id = req.params.id;
    await Dashboard.UpdateUserRol(id);
}

// Tomar el id del usuario a eliminar y enviarlo al delete.
exports.deleteUser = async(req, res, next) => {
    const count_1 = await Dashboard.checkUser(req.params.id)
    const count_2 = await Dashboard.checkUser2(req.params.id)
    const count_3 = await Dashboard.checkUser3(req.params.id)
    tramites_activos=count_1+count_2+count_3
    console.log("Si llegó y su valor es: ",tramites_activos)
    if (tramites_activos==0){
        await Dashboard.DeleteUser(req.params.id);
    }
    else{
        
    }
    
}
// Obtener lista de usuarios disponibles en el sistema.
exports.getUsers = async(req, res, next) => {
    const dataUsers = await Dashboard.fetchAllUsers();
    res.status(200).json({code: 200, code: "Ok", data: dataUsers[0]});
}