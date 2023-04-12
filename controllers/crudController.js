const { uploadMedia } = require('../helper/multerMedia');
const path = require('path');
const fs = require('fs');
const Text = require('../models/testText');
const Media = require('../models/testMedia');

// Operaciones de Create ---------------

exports.getCreate = (req, res, next) => {
    res.render('create')
}

exports.postCreateText = (req, res, next) => {
    const text = req.body.nombreText;
    Text.insertRegister(text);
    res.redirect('/crud/read');
}

exports.postCreateMedia = (req, res, next) => {
    var upload = uploadMedia.array('media',1);
    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        const text = req.body.nombreMedia;
        var pathDest = req.files[0].destination.slice(1);
        var finalPath = path.join(__dirname, '../'+pathDest);
        const filename = req.files[0].filename;
        //res.status(200).json({code: 200, msg:"Ok"}); 
        Media.insertRegister(text,finalPath,filename);
        res.redirect('/crud/read');
    })
}

exports.postCreateFile = (req, res, next) => {
    
}

// Operaciones de Read -----------------

exports.getRead = (req, res, next) => {
    res.render('read')
}

exports.getReadText = async(req, res, next) => {
    const data  = await Text.fecthAll();
    res.status(200).json({code:200,code:"Ok",data:data[0]})
}

exports.getReadMedia = async(req, res, next) => {
    const data  = await Media.fecthAll();
    res.status(200).json({code:200,code:"Ok",data:data[0]})
}

// Operaciones de Update ---------------

exports.getUpdate = (req, res, next) => {
    res.render('update')
}

exports.updateRegisterById = async(req, res, next) => {
    const id = req.params.id;
    const text = req.body.descripcion;
    await Text.updateRegisterById(id,text);
}

// Operaciones de Delete ---------------

exports.getDelete = (req, res, next) => {
    res.render('delete')
}

exports.deleteTextById = async(req, res, next) => {
    const id = req.params.id;
    await Text.deleteRegisterById(id);
}

exports.deleteMediaById = async(req, res, next) => {
    const id = req.params.id;
    const path = await Media.fetchPathById(id);
    const name = await Media.fetchArchiveNameById(id);
    fs.unlink(path[0][0].mediaRoute +"/"+ name[0][0].mediaName, (err) => {
        if (err) {
            throw err;
        }
    });
    await Media.deleteRegisterById(id);
}

// Menu de CRUD ------------------------

exports.getHomepage = (req,res,next) => {;
    res.render('homepageCRUD');
};