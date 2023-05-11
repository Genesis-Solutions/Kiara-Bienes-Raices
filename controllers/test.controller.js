const Test = require('../models/test.model');

exports.getTestPage = (req, res, next) => {
    // Renderizar la vista de la lista de Propiedades
    res.render("testImageUpload", {
        isLogged: req.session.isLoggedIn,
        idRol: req.session.idRol,
    });
};

// exports.getUsers = async (req, res, next) => {
//     const dataUsers = await Dashboard.fetchAllUsers();
//     res.status(200).json({ code: 200, code: "Ok", data: dataUsers[0] });
// }
