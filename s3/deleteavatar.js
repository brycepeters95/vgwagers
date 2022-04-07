const config = require('config');
const AWS = require('aws-sdk');
const aws_id = config.get('aws_id');
const aws_secret = config.get('aws_secret');

const User = require('../models/User');

module.exports = {
    deleteOldAvatar: async function (userId) {
        const s3 = new AWS.S3({
            accessKeyId: aws_id,
            secretAccessKey: aws_secret,
            Bucket: 'vgw-avatars'
          });

        try {
            const user = await User.findById(userId).select('avatar');
            console.log(user);
            if (user.avatar != '' || user.avatar != undefined || user.avatar != null) {
                let filename = user.avatar;

                //Grab image name from url of user's pervious avatar
                filename = filename.split("/");
                filename = filename[3];
                filename = decodeURIComponent(filename);

                const params = {
                    Bucket: 'vgw-avatars',
                    Key: filename
                }

               s3.deleteObject(params, function(err, data) {
                   if (err) {
                       console.log(err);
                   } else {
                       console.log(`Deleted: ${filename}`);
                   }
               });
            } else {
                return;
            }
        } catch (err) {
            console.log(err);
        }

    }
}