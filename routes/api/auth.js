const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const nodemailer = require('nodemailer');
const cryptoRandomString = require('crypto-random-string');
const axios= require('axios');
const aws = require('aws-sdk');
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');
const Verify = require('../../models/Verify');
const awsST = require('../../middleware/awsST');


// const { request } = require('https');
// @route    GET api/auth
// @desc     get user by token
// @access   Private

//whenever we want to use middleware(auth) add it as second parm to make route protected
//since we used token which has id we can access anywhere in protected route(req.user.id)
router.get('/', auth, async (req, res) => { 
  try {
  
    const user = await User.findById(req.user.id).select('-password');
   

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get token & login user
// @access   Public
router.post(
  '/',awsST,
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    //might change email to username
    const { email, password} = req.body;
      // if(req.body.value === undefined ||
      //   req.body.value === '' ||
      //   req.body.value === null
      //   ){
      //     return res.status(400).json({
      //       errors: [
      //         {
      //           msg: 'please select captcha',
      //         },
      //       ],
      //     });
      //   }
      //   const secretKey = config.get("google_secret");

      //   const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}
      //   &response=${req.body.value}`;
    
    try {
      // const response =await axios.post(verifyURL);
      // // console.log(response);
      //   const body = response.data

      //   if(body.success !== undefined && !body.success){
      //     return res.status(400).json({
      //       errors: [
      //         {
      //           msg: 'failed Captcha',
      //         },
      //       ],
      //     });
      //   }
   
      let user = await User.findOne({
        email,
      });
      //check to see if their is not a user
      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg: 'Invalid Credentials',
            },
          ],
        });
      }
      //bcrypt has method to compare plain text password and encrpyt password
      const isMatch = await bcrypt.compare(password, user.password);
      //if password do not match
      if (!isMatch) {
        return res.status(400).json({
          errors: [
            {
              msg: 'Invalid Credentials',
            },
          ],
        });
      }


      const payload = {
        user: {
          id: user.id,
        },
      };
      console.log(user, 'userloggedin')
      console.log(req.secret,'f')
      jwt.sign(
        payload,
       req.secret,
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.get('/verify/:stringforUser', async (req, res) => {
  const randomstring = await Verify.findOne({
    stringforuser: req.params.stringforUser,
  });

  if (!randomstring) return res.status(400).json({ msg: 'invalid link' });
  let verify = await User.findOneAndUpdate(
    { _id: randomstring.user },
    { $set: { verify: true } },
    { new: true }
  );

  res.json('your email has been verified');
});

router.get('/email', auth, async (req, res) => {
  const email = await User.findOne({ _id: req.user.id }).select('email');
  const verify = await Verify.findOne({ user: req.user.id });
  const randomstring = cryptoRandomString({ length: 128, type: 'url-safe' });
  if (!verify) {
    const verify = new Verify({
      user: user.id,
      stringforuser: randomstring,
    });

    await verify.save();
  } else {
    let verify = await Verify.findOneAndUpdate(
      { user: req.user.id },
      { $set: { stringforuser: randomstring } },
      { new: true }
    );
  }
  let transport = nodemailer.createTransport({
    host: 'smtp.fastmail.com',
    secureConnection: true,
    port: 465,
    auth: { user: 'vgwagers@vgwagers.com', pass: 'ahrb8u6xv9mv7xj8' },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
  });
  // customize link
  const message = {
    from: 'vgwagers@vgwagers.com', // Sender address
    to: email, // List of recipients
    subject: 'verify email', // Subject line
    html: `<a href = "https://vgwagers.com/api/auth/verify/${randomstring}">Click to Confirm</a>`,
  };
  transport.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
    }
  });
  res.sendStatus(200);
});

// router.get('/getSecret', async(req,res)=>{
 
//   let region = "us-east-2";
//   let secretName = "test/vgwagers/jwt";
//   let secret;
//   let decodedBinarySecret;

// // Create a Secrets Manager client
// var client = new aws.SecretsManager({
//    accessKeyId: "AKIAITQTUPHSP7LMMVPQ",
//    secretAccessKey: "RSCw1OkCFKZGUz+1nY4krTLQi7WwOP6zKigAE5z5",
//    region: region
// });

// // In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
// // See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
// // We rethrow the exception by default.

// client.getSecretValue({SecretId: secretName}, function(err, data) {

//    if (err) {
//        if (err.code === 'DecryptionFailureException')
//            // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
//            // Deal with the exception here, and/or rethrow at your discretion.
//            throw err;
//        else if (err.code === 'InternalServiceErrorException')
//            // An error occurred on the server side.
//            // Deal with the exception here, and/or rethrow at your discretion.
//            throw err;
//        else if (err.code === 'InvalidParameterException')
//            // You provided an invalid value for a parameter.
//            // Deal with the exception here, and/or rethrow at your discretion.
//            throw err;
//        else if (err.code === 'InvalidRequestException')
//            // You provided a parameter value that is not valid for the current state of the resource.
//            // Deal with the exception here, and/or rethrow at your discretion.
//            throw err;
//        else if (err.code === 'ResourceNotFoundException')
//            // We can't find the resource that you asked for.
//            // Deal with the exception here, and/or rethrow at your discretion.
//            throw err;
//    }
   
//    else {
//        // Decrypts secret using the associated KMS CMK.
//        // Depending on whether the secret is a string or binary, one of these fields will be populated.
//        if ('SecretString' in data) {
//             secret = data.SecretString;
//           //  console.log(Object.keys(data.SecretString),'j')
         
//        } else {
//            let buff = new Buffer(data.SecretBinary, 'base64');
//            secret = buff.toString('ascii');
//            console.log('hit1')
           
//        }
//    }
//    let newSecret= JSON.parse(secret)
//    newSecret= Object.values(newSecret);
//   //  const value = newSecret[0];
//    res.json(newSecret[0])
// });
// // return secret;
  
// })

module.exports = router;
