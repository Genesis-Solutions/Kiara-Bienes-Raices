const AWS_BUCKET = "kiarabienesraices";
const AWS = require('aws-sdk');

AWS.config.update({
    signatureVersion: 'v4',
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

module.exports = s3;