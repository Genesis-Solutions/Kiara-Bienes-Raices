const Test = require('../models/test.model');
const { uploadMedia } = require('../util/testLocalMulter.util');
const { storage } = require('../util/awsMediaMulter.util');

exports.getTestPage = (req,res,next) => {
    // Renderizar la vista de test
    res.render("testImageUpload", {
        isLogged: req.session.isLoggedIn,
        idRol: req.session.idRol,
    });
};

exports.postLocalImage = (req,res,next) => {
    var upload = uploadMedia.array('mediaLocal',1);
    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        //var pathDest = req.files[0].destination.slice(8);
        const filename = req.files[0].filename;
        //console.log(pathDest);
        console.log(filename);
        //res.status(200).json({code: 200, msg:"Ok"}); 
        res.redirect('/test');
    })
}

exports.postS3SingleImage = (req,res,next) => {
    var upload = storage.array('singleMediaS3', 1);
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
        }
        //const mediaName = file.key;
        //console.log(mediaName);
        console.log("Desde el upload de single image");
    });
    //res.status(200).json({code: 200, msg:"Ok"}); 
    res.redirect('/test');
};

exports.postS3MultipleImages = (req,res,next) => {
    console.log("Entrando a multiple images");
    console.log("Antes del log de req.body");
    console.log(req.body);
    console.log("Antes del log de req.files");
    console.log(req.files);
    var upload = storage.array('uploadedImages');
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
        } else {
            req.files.forEach(function (file) {
                const mediaName = file.key;
                console.log("mediaName: ",mediaName);
                console.log("Desde el multiple upload a s3");
            });
        }
    });
    ///res.status(200).json({code: 200, msg:"Ok"}); 
    res.redirect('/test');
};

exports.postDropzoneLocal = (req,res,next) => {
    var upload = uploadMedia.array('mediaDropzoneLocal', 25);
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
        } else {
            req.files.forEach(function (file) {
                //var pathDest = req.files[0].destination.slice(8);
                const filename = req.files[0].filename;
                //console.log(pathDest);
                console.log(filename);
            });
        }
    });
    //res.status(200).json({code: 200, msg:"Ok"}); 
    res.redirect('/test');
};

exports.postDropzoneS3 = (req, res, next) => {
    var upload = storage.array('mediaDropzoneS3', 25);
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
        } else {
            req.files.forEach(function (file) {
                const mediaName = file.key;
                console.log(mediaName);
                console.log("Desde el upload de dropzone a s3");
            });
        }
    });
    //res.status(200).json({code: 200, msg:"Ok"}); 
    res.redirect('/test');
};