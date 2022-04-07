
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('config');
const AWS = require('aws-sdk');
const aws_id = config.get('aws_id');
const aws_secret = config.get('aws_secret');
const path = require('path')

const s3Config = new AWS.S3({
    accessKeyId: aws_id,
    secretAccessKey: aws_secret,
    Bucket: 'vgw-disp-media'
  });

// const fileFilter = (req, file, cb) => {
  
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'video/mkv') {
//         cb(null, true)
//     } else {
//         cb(null, false)
//     }
// }



const multerS3Config = multerS3({
    s3: s3Config,
    bucket: 'vgw-disp-media',
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
      fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' 
        && ext !== '.jpeg' && ext !== '.mkv' && ext !== '.mov' && ext !== '.mp4') {
            return callback(new Error('Only images and videos allowed'))
        }
        callback(null, true)
    },
    limits: {
        fileSize: 1024 * 1024 * 7 // we are allowing only 7 MB files
    }
})


exports.disputeformuploadaws = upload; 