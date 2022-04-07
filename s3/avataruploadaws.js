const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('config');
const AWS = require('aws-sdk');
const aws_id = config.get('aws_id');
const aws_secret = config.get('aws_secret');

const s3Config = new AWS.S3({
    accessKeyId: aws_id,
    secretAccessKey: aws_secret,
    Bucket: 'vgw-avatars'
  });

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const multerS3Config = multerS3({
    s3: s3Config,
    bucket: 'vgw-avatars',
    acl: 'public-read',
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        console.log(file)
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
});

const upload = multer({
    storage: multerS3Config,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 7 // we are allowing only 7 MB files
    }
})

exports.avataruploadaws = upload;