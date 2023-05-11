const Test = require('../models/test.model');
const { uploadMedia } = require('../util/testLocalMulter.util');
const { storage } = require('../util/awsMediaMulter.util');

exports.getTestPage = (req,res,next) => {
    // Renderizar la vista de la lista de Propiedades
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
        const text = req.body.nombreMedia;
        var pathDest = req.files[0].destination.slice(8);
        const filename = req.files[0].filename;
        console.log(text);
        console.log(pathDest);
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
        const mediaName = file.key;
    });
    console.log(mediaName);
    //res.status(200).json({code: 200, msg:"Ok"}); 
    res.redirect('/test');
};