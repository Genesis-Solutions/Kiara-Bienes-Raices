const path = require('path');
const User = require('../models/dashboard.model');
const Dashboard = require('../models/dashboard.model');


// -- LIST USERS -- //
exports.getDashboard = (req, res, next) => {
    //Revisar que tenga el rol de administrador
    if (req.session.rol !== 1) {
        return res.status(40.).send("No tiene autorizado acceder a esta página")
    }
    // Renderizar la vista de registro
    res.render("listUsers");
}

exports.getUsers = async (req, res, next) => {
    const dataUsers = await Dashboard.fetchAllUsers();
    res.status(200).json({code: 200, code: "Ok", data: data[0]})
}