const express = require('express');
const router = express.Router();

const axios = require('axios');
const config = require('config');
const paypal_client_id = config.get('paypal_client_id');
const paypal_secret = config.get('paypal_secret');

const auth = require('../../middleware/auth');
// const { check, validationResult } = require('express-validator/check');
const Big = require('big.js');

const Bank = require('../../models/Bank');
const User = require('../../models/User');
const Payout = require('../../models/Payout');
const Transaction = require('../../models/Transaction');

const { url } = require('gravatar');
const { sign } = require('crypto');


var tempTotal = 0;

// @route    Get api/bank
// @desc     get bank by user id
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    let bank = await Bank.findOne({ user: req.user.id });

    if (!bank) {
      return res.status(400).json({ msg: 'There is no bank for this user' });
    }

    res.json(bank);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    Get api/bank
// @desc     get bank by user id
// @access   Private
// add a verify check
router.post('/addFunds', auth, async (req, res) => {
  
  try {
    const user = await User.findOne({_id: req.user.id});
    const userVerify = user.verify;
    console.log(userVerify)
    if (userVerify === false){
      return res.status(400).json({
        errors: [
          {
            msg: 'please verify email',
          },
        ],
      });
    }  

    console.log(req.body,'req.body')
    const { oid } = req.body;
    const newTransaction = new Transaction({
      user: req.user.id,
      id: oid
    });

    await newTransaction.save()
    res.status(200).send('Ob  jkgfK');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

router.post('/postFunds', async (req, res) => {
  try {
    console.log('request from paypal');
    const { headers } = req;
    const request = req.body;
    const id = request.resource.id;
    console.log(id);
    const total = request.resource.purchase_units[0].amount.value;

    const url_token = 'https://sandbox.api.paypal.com/v1/oauth2/token';

    const {
      data: { access_token },
    } = await axios({
      url: url_token,
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en_US',
        'content-type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: paypal_client_id,
        password: paypal_secret,
      },
      params: {
        grant_type: 'client_credentials',
      },
    });
    // console.log(req.body, 'body')
    console.log('access token: ',access_token);
    
    const data = {
      'transmission_id':  headers['paypal-transmission-id'],
      'transmission_time': headers['paypal-transmission-time'],
      'cert_url': headers['paypal-cert-url'],
      'auth_algo': headers['paypal-auth-algo'],
      'transmission_sig': headers['paypal-transmission-sig'],
      'webhook_id': '8EU39272V3389440R',
      'webhook_event': req.body
    };

    const vs = await axios({
      url: 'https://sandbox.api.paypal.com/v1/notifications/verify-webhook-signature',
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${access_token}`
      },
      data: data
    });
  
    
    console.log('VERIFY WEBHOOK SIGNATURE', vs);
    // console.log(vs.data.verification_status, 'hittttttt');

    if (vs.data.verification_status !== 'SUCCESS') {
      return res.status(401).send('Unauthorized');
    }

    const orderInfoUrl = `https://sandbox.api.paypal.com/v2/checkout/orders/${id}/capture`;

    const response = await axios({
      url: orderInfoUrl,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      } 
    });
    
      console.log(response,'responseeeee')
    
    if (response.data.status === 'COMPLETED') {
        let transaction = await Transaction.findOne({id: id});
        let bank = await Bank.findOne({user: transaction.user});
        bank.transactions.unshift({
          id: id,
          type: 'deposit',
          amount: total,
          date: Date.now()
        });
  
        const bigTotal = new Big(total);
        const bigBankBalance = new Big(bank.balance);
        bank.balance = bigBankBalance.plus(bigTotal);
  
         await bank.save();
         
         await transaction.remove();
         
    } else {
      return res.status(400);
    }

    //console.log(response.data);
  
  
    res.status(200).send('OK');
  } catch (err) {
    console.log(err, 'errrrrrrrrrrrr');
    res.status(400);
  }
});

router.get('/getTransactions', auth, async (req, res) => {
  try {
    
    let bank = await Bank.findOne({ user: req.user.id }).select('transactions');
    
    res.json(bank.transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/bank
// @desc     User requested payouts from their bank balance
// @access   Private
router.post('/requestPayout', auth, async (req, res) => {
  try {
    let { total } = req.body;
    total = parseFloat(total).toFixed(2);

    if (total < 0 || isNaN(total)) {
      return res
      .status(400)
      .json({
        errors: [
          {
            msg: 'Invalid total.'
          }
        ] 
       });
    }

    
    
    const user = await User.findById(req.user.id).select('username email');
    const email = user.email;
   
    let bank = await Bank.findOne({user: user._id});
    console.log(bank);

    if (total > bank.balance) {
      return res
        .status(400)
        .json({
          errors: [
            {
              msg: 'You are requesting more funds than your account has available. Please try a lower total.'
            }
          ] 
         });
    }
    if(bank.time < Date.now()){
      bank.limit = 0;
    }else if(bank.limit === 3 ){
        return res
        .status(400)
        .json({
          errors: [
            {
              msg: 'You have requested too many payout for the day.'
            }
          ] 
         });
      }
      
    if(bank.limit === 0){
      bank.time = Date.now();
      bank.time.setHours(bank.time.getHours()+ 24)
    }
    bank.limit = bank.limit + 1

    const payout = new Payout({
      username: user.username,
      user: user._id,
      email: email,
      amount: total
    });
    await payout.save();
    const newTrans = {
      id: payout.id,
      date: Date.now(),
      amount: total,
      type: 'withdrawl'
    };

    let parseTotal = new Big(total);
    console.log(parseTotal, typeof parseTotal);
    let parseBankBalance= new Big(bank.balance);
    console.log(bank.balance, typeof bank.balance);
    bank.balance = parseBankBalance.minus(parseTotal).valueOf();
    console.log(bank.balance, typeof bank.balance);
    bank.transactions.push(newTrans);

  await bank.save();

  
  res.json(bank);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})


module.exports = router;
