// Base controlador
const path = require('path');

exports.root = (req,res,next) => {
    res.render('index')
}