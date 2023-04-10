const { upload } = require('../middleware/multer');
const path = require('path');
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
    var uploadMedia = upload.array('media',1);
    uploadMedia(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        const text = req.body.nombreMedia;
        var pathDest = req.files[0].destination.slice(1);
        console.log("pathDest",pathDest);
        var finalPath = path.join(__dirname, '../'+pathDest);
        //res.status(200).json({code: 200, msg:"Ok"}); 
        Media.insertRegister(text,finalPath);
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
    await Media.deleteRegisterById(id);
}

// Menu de CRUD ------------------------

exports.getHomepage = (req,res,next) => {;
    res.render('homepageCRUD');
};