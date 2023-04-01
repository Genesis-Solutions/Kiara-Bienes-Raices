// Base controlador
const path = require('path');

exports.getCreate = (req, res, next) => {
    res.render('create')
}

exports.postCreate = (req, res, next) => {
    
}

exports.getRead = (req, res, next) => {
    res.render('read')
}

exports.getUpdate = (req, res, next) => {
    res.render('update')
}

exports.getDelete = (req, res, next) => {
    res.render('delete')
}