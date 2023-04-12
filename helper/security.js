var path = require('path');
var fs = require('fs');
var Promise = require('promise');
var zlib = require('zlib');
var crypto = require('crypto');
var AppendInitVect = require('./AppendInitVect');
var log = console.log;

function getCipherKey(password) {
    return crypto.createHash('sha256').update(password).digest();
}

exports.encryptFile = function(filePath, originalName, password) {
    return new Promise(function(resolve,reject) {
        log("Empezando encriptación")
        log(filePath)
        log(originalName)
        const initVect = crypto.randomBytes(16);
        // Generate a cipher key from the password.
        const CIPHER_KEY = getCipherKey(password);
        const readStream = fs.createReadStream(filePath+"/"+originalName);
        const gzip = zlib.createDeflate();
        const cipher = crypto.createCipheriv('aes256', CIPHER_KEY, initVect);
        const appendInitVect = new AppendInitVect(initVect);
        // Create a write stream with a different file extension.
        const writeStream = fs.createWriteStream(path.join(filePath+"/"+originalName + ".enc"));
        log("Previo encriptación")
        readStream
        //.pipe(gzip)
        .pipe(cipher)
        .pipe(appendInitVect)
        .pipe(writeStream).on('finish', () => {
            ////log('All writes are now complete.');
            log("Finalizando encriptación")
            fs.access(filePath+"/"+originalName, fs.F_OK, (err) => {
                if (err) {
                    console.error(err)
                    resolve({type:"ENCRYPT", msg:"ERROR", error: err})
                }
                fs.unlink(filePath+"/"+originalName, (err) => {
                    if (err) {
                        console.error(err)
                        resolve({type:"ENCRYPT", msg:"ERROR", error: err})
                    }
                    //const fileName = path.join(filePath+"/"+originalName + ".enc")
                    resolve({type:"ENCRYPT", msg:"OK", error: null})
                })
            })
        });
    });
}