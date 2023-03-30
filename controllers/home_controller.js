const { request, response } = require('express');

// Controlador de vista principal
exports.view = (request, response, next) => {
    console.log('Someone has entered the HomPage...');
    response.render('home_page');
};