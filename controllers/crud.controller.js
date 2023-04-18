const { uploadMedia } = require('../helper/MulterMedia.Helper');
const { uploadFile } = require('../helper/MulterFile.Helper');
const path = require('path');
const fs = require('fs');
const Security  = require('../helper/Security.Helper');
const Text = require('../models/TestText.Model.js');
const Media = require('../models/TestMedia.Model');
const File = require('../models/TestFile.Model');

// Operaciones de Create ---------------

exports.getCreate = ( req, res, next ) => {
    res.render('Create');
}

exports.postCreateText = ( req, res, next ) => {
    const text = req.body.nombreText;
    Text.insertRegister(text);
    res.redirect('/crud/read');
}

exports.postCreateMedia = ( req, res, next ) => {
    var upload = uploadMedia.array('media',1);
    upload(req,res,function(err) {
        if(err) {
            //console.log(err);
            return res.end("Error uploading file.");
        }
        const text = req.body.nombreMedia;
        //var pathDest = req.files[0].destination.slice(1);
        var pathDest = req.files[0].destination.slice(8);
        //var finalPath = path.join(__dirname, '../'+pathDest1);
        const filename = req.files[0].filename;
        //res.status(200).json({code: 200, msg:"Ok"}); 
        Media.insertRegister(text,pathDest,filename);
        res.redirect('/crud/read');
    })
}

exports.postCreateFile = ( req, res, next ) => {
    var upload = uploadFile.array('file',1);
    upload(req,res,function(err) {
        if(err) {
            //console.log(err);
            return res.end("Error uploading file.");
        }
        const text = req.body.nombreFile;
        var pathDest = req.files[0].destination.slice(8);
        //var finalPath = path.join(__dirname, '../'+pathDest);
        const filename = req.files[0].filename;
        const encFilename = req.files[0].filename+".enc";
        var original = "SECRET_KEY_USERS";
        Security.encryptFile("./assets/file",filename,original)
        .then(function(results){
            //console.log(req.files[0]);
            res.status(200).json({code: 200, msg:"Ok"});
        })
        //res.status(200).json({code: 200, msg:"Ok"}); 
        File.insertRegister(text,pathDest,encFilename);
        res.redirect('/crud/read');
    })
}

// Operaciones de Read -----------------

exports.getRead = ( req, res, next ) => {
    res.render('Read');
}

exports.getReadText = async( req, res, next ) => {
    const data  = await Text.fecthAll();
    res.status(200).json({code:200,code:"Ok",data:data[0]});
}

exports.getReadMedia = async( req, res, next ) => {
    const data  = await Media.fecthAll();
    res.status(200).json({code:200,code:"Ok",data:data[0]});
}

exports.getReadFiles = async( req, res, next ) => {
    const data  = await File.fecthAll();
    res.status(200).json({code:200,code:"Ok",data:data[0]});
}

// Operacion de desencriptacion --------

exports.desencriptar = ( req, res, next ) => {
    req.setTimeout(4500000);
    var original = "SECRET_KEY_USERS";
    var name = req.params.name;
    Security.decryptFile("./assets/file/",name,original).then(function(results){
        res.status(200).json({code: 200, msg:"Ok"});
    });
}

// Operaciones de Update ---------------

exports.getUpdate = ( req, res, next ) => {
    res.render('Update');
}

exports.updateTextById = async( req, res, next ) => {
    const id = req.params.id;
    const text = req.body.descripcion;
    await Text.updateRegisterById(id,text);
}

exports.updateMediaById = async( req, res, next ) => {
    var upload = uploadMedia.array('mediaUpdate',1);
    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        const id = req.body.idMedia;
        const descripcion = req.body.mediaDesc;
        const ruta = req.body.mediaRoute;
        const media = req.body.media;
        var pathDest = req.files[0].destination.slice(1);
        var finalPath = path.join(__dirname, '../'+pathDest);
        const filename = req.files[0].filename;
        Media.updateRegisterById(id,descripcion,filename);
        fs.unlink(ruta +"/"+ media, (err) => {
            if (err) {
                throw err;
            }
        });
        res.redirect('/crud/read');
    })
}

// Operaciones de Delete ---------------

exports.getDelete = ( req, res, next ) => {
    res.render('Delete')
}

exports.deleteTextById = async( req, res, next ) => {
    const id = req.params.id;
    await Text.deleteRegisterById(id);
}

exports.deleteMediaById = async( req, res, next ) => {
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

exports.getHomepage = ( req, res, next ) => {;
    res.render('HomepageCrud');
};