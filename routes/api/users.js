const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
const cryptoRandomString = require('crypto-random-string');
const axios = require('axios');
const PasswordReset =require('../../models/PasswordReset');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Verify = require('../../models/Verify');
const Bank = require('../../models/Bank');
const moment = require('moment');
const nodemailer = require('nodemailer');
const auth = require('../../middleware/auth');
const Taxes = require('../../models/Taxes');
const cryptojs = require('crypto-js');
const AES = require('crypto-js/aes')
const { encrypt} = require('./aws_kms');
const {getTaxInfo, getTheTaxMessage}= require('./wager_helpers');
const awsST = require('../../middleware/awsST');

// @route    POST api/users  (actual request type and endpoint)
// @desc     Register user   (what it does)
// @access   Public         (public or private)
router.post(
  '/',
  awsST,
  [
    check('username', 'Please enter a Username with 6 or more characters')
      .not()
      .isEmpty()
      .isLength({ min: 6 }),
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    //DESTRUCT from req.body frontend entered
  console.log("hit1");
    const { username, name, email, password} = req.body;
    console.log(req.body,'checkbody')

    // if(req.body.captchaValue === undefined ||
    //   req.body.captchaValue === '' ||
    //   req.body.captchaValue === null
    //   )
    //   {
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
    //   &response=${req.body.captchaValue}`;

    //   console.log('hit2')



    // console.log(value);
    const date = moment().toISOString();
    console.log(date);
     const dateSplit = date.split("-"); 
     const valueSplit = value.split("-");
   const dateYear = dateSplit[0];
   const dateMonth = dateSplit[1];
   const dateDay  = dateSplit[2].substr(0,2);
   const userYear = valueSplit[0]+18;
   const userMonth= valueSplit[1];
   const userDay= valueSplit[2].substr(0,2);
    
  if (userYear > dateYear){
    return res.status(400).json({
      errors: [
        {
          msg: 'You have to be 18 or older to sign up year',
        },
      ],
    });
    
  } else if (userYear === dateYear){
    if (userMonth > dateMonth){
      return res.status(400).json({
        errors: [
          {
            msg: 'You have to be 18 or older to sign up month',
          },
        ],
      });
    } else if (userMonth === dateMonth){
      if(userDay > dateDay){
      return res.status(400).json({
        errors: [
          {
            msg: 'You have to be 18 or older to sign up day',
          },
        ],
      });
    }   
  }
 }
  console.log('hit3')
    //see if user exist by checking user email
    //if it does send error user already exist
    try {
      // const response =await axios.post(verifyURL);
      // console.log(response,'responsecaptcha');
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
      let useremail = await User.findOne({
        email,
      });
      if (useremail) {
        return res.status(400).json({
          errors: [
            {
              msg: 'email already exists',
            },
          ],
        });
      }
      let userusername = await User.findOne({
        username,
      });
      if (userusername) {
        return res.status(400).json({
          errors: [
            {
              msg: 'Username already exists',
            },
          ],
        });
      }
      console.log('hit4')
      //setting up avatar for user, s- size, r- rating, d- default img
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      //create new instance of user, pass in object with fields we want
      user = new User({
        username,
        name,
        email,
        avatar,
        password,
      });

      //encrpyt password using bcrypt, (10)=rounds
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);
      //save user to db
      await user.save();

      const profile = new Profile({
        user: user.id,
        bio:'',
        social:{
        twitter:'',
        youtube:'',
        instagram:'',
        },
        gamertags:{
        pc:'',
        xbox:'',
        playstation:'',
        }
      });
      await profile.save();

      const bank = new Bank({
        user: user.id,
        transactions: [],
      });
      await bank.save();
      
      userTax = new Taxes({
        user: user.id,
        fullName:'e',
        ssn:'e',
        mailingAddress:'e'

      });
    
await userTax.save();

      //payload is object with a user which has a id
      const payload = {
        user: {
          id: user.id,
        },
      };
      const verify = new Verify({
        user: user.id,
        stringforuser: cryptoRandomString({ length: 128, type: 'url-safe' }),
      });


      await verify.save();

      //take in (payload, jwtsecret), options to expire 1hr
      //!!!change to 3600 before deploying, return json token to client or err(3600= 1hr)
      jwt.sign(
        payload,
       req.secret,
        {
          expiresIn: 3600,
        },

        (err, token) => {
          console.log(token,'tokennnnnnnnnn')
          if (err) throw err;
          res.json({
            token,
          });
        }
       
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    POST api/user/forgotpassword
// @desc     Set up entry in passwordreset collection and email user password reset link
// @access   Public
router.post('/forgotpassword', async (req, res) => {
  const {email} = req.body;

  try {
    const userEmail = await User.findOne({email: email}).select('email');
    let passwordReset = await PasswordReset.findOne({email: email})
  
    // Account does not exist
    if (!userEmail) {
      return res.status(400).json({
        errors: [
          {
            msg: 'There is no Account Associated with this Email',
          },
        ],
      });
    }
  
    // Prevent multiple entries in the resetpassword collection
    if (passwordReset) {
      await PasswordReset.findOneAndRemove({ _id: passwordReset.id}, err =>{
        if (err) {
          throw err;
        } else {
          console.log('Deleted');
        }
      });
    }
    const urlparam = cryptoRandomString({ length: 256, type: 'url-safe' });

    // set time to live of 10 minutes
    let ttl = Date.now();
    let newTTL = new Date(ttl);
    newTTL.setMinutes(newTTL.getMinutes() + 10);
    ttl = newTTL;

    passwordReset = new PasswordReset({
      email: email,
      urlparam: urlparam,
      ttl: ttl
    });

 

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
      subject: 'Reset Password', // Subject line
      html: `<a href = "http://localhost:3000/reset-password/${urlparam}">Click to Reset Password/a>`,
   };
    transport.sendMail(message, function (err, info) {
      if (err) {
        console.log(err);
      }
    });
    await passwordReset.save();
    res.json('A password reset link has been sent to your email.');
  } catch (err) {
      console.log(err);
      res.status(500).send('Server error')
  }
});

// @route    GET api/user/changepassword/:resetCode
// @desc     Verifies validity of link
// @access   Public
router.get('/changepassword/:resetCode', async (req, res) => {
  try {
    const email = await PasswordReset.findOne({
      urlparam: req.params.resetCode
    }).select('email');

    // if code is valid, return email from entry in passwordreset collection
    if (email) {
      return res.json(email.email);
    }

    if (!email) {
      return res.status(404).json({
        errors: [
          {
            msg: 'Invalid link.',
          },
        ],
      });
    }
} catch (err) {
  console.log(err);
  res.status(500).send('Server error');
}
});

// @route    POST api/user/changepassword/:resetCode
// @desc     Allows user to reset password
// @access   Public
router.post('/changepassword', check(
  'password',
  'Please enter a password with 6 or more characters'
  ).isLength({
  min: 6,
  }), async (req, res) => {

const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({
    errors: errors.array(),
  });
}

const {email, password,url} = req.body;
const resetCode = url;

console.log(email,password,url);
try {
  // find entry in db based on randomly generated string
  const passwordReset = await PasswordReset.findOne({urlparam: resetCode});

  // if entry is found and email matches allow password change
  if (passwordReset.email === email) {
   let userPass = await User.findOne({email: passwordReset.email}).select('password');

    //encrpyt password using bcrypt, (10)=rounds
    const salt = await bcrypt.genSalt(10);

    userPass.password = await bcrypt.hash(password, salt);

    //save user to db
    await userPass.save();
 
      await PasswordReset.findOneAndRemove({ _id: passwordReset.id}, err =>{
        if (err) {
          throw err;
        } else {
          console.log('Deleted');
        }
      });
    
    return res.status(200).json('Password Successfully Reset')
  } else {
    return res.status(400).json({
      errors: [
        {
          msg: 'Invalid link.',
        },
      ],
    });
  }
} catch (err) {
  console.log(err);
  res.status(500).send('Server error');
}
});

router.post('/updateTaxInfo', auth, async (req, res) => {
  const {SSN, mailingAddress, fullName} = req.body;
  const ssn = SSN;
  const userId = req.user.id;
  try {
    let userTaxes = await Taxes.findOne({user: userId });

    let encSSN = await encrypt(ssn).then(ciphertextblob => {
        return ciphertextblob.toString('base64');
    });

    let encMA = await encrypt(mailingAddress).then(ciphertextblob => {
        return ciphertextblob.toString('base64');
    });

    userTaxes.ssn = encSSN;
    userTaxes.mailingAddress = encMA;
    userTaxes.fullName = fullName;
    userTaxes.taxPending = true;

    await userTaxes.save();
    res.status(200).send('Ok');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

router.get('/getTaxInfo', auth, async (req, res) => {
  let userTaxes = await Taxes.findOne({user: req.user.id}).select('taxPending taxVerify');
 console.log(userTaxes);
 const taxPending = userTaxes.taxPending;
 const taxVerify = userTaxes.taxVerify;
  const taxMessage = await getTheTaxMessage( taxPending, taxVerify);
  
  try {
    // console.log(userTaxes)
    //  if(userTaxes.taxVerify && userTaxes.taxVerify === false){
    //   return taxMessage = 'hi'
    // }else if (userTaxes.taxPending === true && useTaxes.taxVerify === false){
    // return  taxMessage ='yu'
    // }else{
    // return  taxMessage ='au'
    // }
    res.json(taxMessage);

  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});



module.exports = router;
