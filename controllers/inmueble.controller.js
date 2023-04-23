// Base controlador
const path = require('path');
const Inmueble = require('../models/inmueble.model');

// Obtiene los datos del inmueble

exports.getInmueble = async (req, res, next) => {
    const inmueble = await Inmueble.getInmueble(req.params.idInmueble);
    const idAgente = await Inmueble.getIdAgente(req.params.idInmueble);
    const agente = Inmueble.getInfoAgente(idAgente);

    res.render('inmueble', {
        inmuebles : inmueble,
        agente : agente,
    })
};
