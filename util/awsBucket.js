const AWS_BUCKET = "kiarabienesraices";
const AWS_ACCESS_KEY_ID = "AKIAWTMRNQK5WQNCVW47";
const AWS_SECRET_ACCESS_KEY = "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";
const AWS = require('aws-sdk');

AWS.config.update({
    signatureVersion: 'v4',
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

module.exports = s3;