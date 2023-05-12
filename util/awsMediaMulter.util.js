const multer = require("multer");
var multerS3 = require('multer-s3');
const s3 = require("./awsBucket.js");
const AWS_BUCKET = "kiarabienesraices";

var storage = multer({
    storage: multerS3({
        s3: s3,
        bucket: AWS_BUCKET,
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            console.log("Dentro del multer s3: file-",file)
            return cb(null, "img/"+Date.now()+"-"+file.originalname);
        }
    })
})

module.exports = { storage };