// Base controlador
const path = require('path');

exports.root = async ( res) => {
    res.render('index')
}