// Base controlador
const path = require('path');

exports.root = async (request, response, next) => {
    response.render('listaPropiedades')
}