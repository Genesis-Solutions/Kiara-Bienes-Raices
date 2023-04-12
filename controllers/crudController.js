const { uploadMedia } = require('../helper/multerMedia');
const { uploadFile } = require('../helper/multerFile');
const path = require('path');
const fs = require('fs');
const Security  = require('../helper/security');
const Text = require('../models/testText');
const Media = require('../models/testMedia');
const File = require('../models/testFile');

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
    var upload = uploadFile.array('file',1);
    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        const text = req.body.nombreFile;
        var pathDest = req.files[0].destination.slice(1);
        var finalPath = path.join(__dirname, '../'+pathDest);
        const filename = req.files[0].filename;
        const encFilename = req.files[0].filename+".enc";
        var original = "SECRET_KEY_USERS";
        Security.encryptFile("./assets/file",filename,original)
        .then(function(results){
            console.log(req.files[0])
            res.status(200).json({code: 200, msg:"Ok"})
        })
        //res.status(200).json({code: 200, msg:"Ok"}); 
        File.insertRegister(text,finalPath,encFilename);
        res.redirect('/crud/read');
    })
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

exports.updateTextById = async(req, res, next) => {
    const id = req.params.id;
    const text = req.body.descripcion;
    await Text.updateRegisterById(id,text);
}

exports.updateMediaById = async(req, res, next) => {
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