const aws = require('aws-sdk');
const config = require('config');
const aws_kms_access = config.get('aws_kms_access');
const aws_kms_secret = config.get('aws_kms_secret');
const aws_kms_key_id = config.get('aws_kms_key_id');

module.exports = {
    encrypt: function (string) {
        const kms = new aws.KMS({
            accessKeyId: aws_kms_access,
            secretAccessKey: aws_kms_secret,
            region: 'us-east-2'
        });

        return new Promise((resolve, reject) => {
            const params = {
                KeyId: aws_kms_key_id,
                Plaintext: string,
            };
            kms.encrypt(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.CiphertextBlob);
                }
            });
        });
    },

    decrypt: function (string) {
        const kms = new aws.KMS({
            accessKeyId: aws_kms_access,
            secretAccessKey: aws_kms_secret,
            region: 'us-east-2'
        });

        return new Promise((resolve, reject) => {
            const params = {
                CiphertextBlob: string
            };
            kms.decrypt(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Plaintext);
                }
            });
        });
    },


}