const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Big = require('big.js');
const User = require('../../models/User');
const Bank = require('../../models/Bank');
const CompletedWager = require('../../models/CompletedWager');
const DisputedWager = require('../../models/DisputedWager');
const TeamWager = require('../../models/TeamWager');
const Chat = require('../../models/Chat');
const multer = require('multer');
const upload = multer();
const { disputeformuploadaws } = require('../../s3/disputeformuploadaws');
const {verifyNotInMatch, isAcceptingPlayerOnATeam, notInHomeTeam, doesUserExist, validateBank, verifyTeams, yearlyEarningCheck, checkedLockedUsers, checkedDays, checkForFreeWager} = require('./wager_helpers');
const { check } = require('express-validator');



// @route  Post /api/wager/teamWagers
// @desc   create private team wager
// @access Private
router.post('/teamWagers', auth, async (req, res) => {
  try {
     const {  awayTeam, createTheWager, selectedGame, bestOf} = req.body;
    let{ homeTeam } = req.body
    const description = createTheWager.description;
    const game = selectedGame;

    let WAGER_FEE = 0;
    const MIN_WAGER = 1.0;
    const MAX_WAGER = 300.0;


if(game.length > 50 || description > 250){
  return res.status(400).json({
    errors: [
      {
        msg:
          'Game or description value is too long',
      },
    ],
  });
}


  let{amount} = req.body
    amount = parseFloat(amount).toFixed(2);

    let userCreating = await User.findById(req.user.id).select(
      'username inMatch yearlyEarnings taxVerify locked lockedTTL feeFree won lost '
    );
     let date = Date.now();
    let updateDate = date - userCreating.lockedTTL;
    const days = await checkedDays(updateDate);

     const checkLocked = checkedLockedUsers(userCreating);
      if(checkLocked === false){
        return res.status(400).json({
          errors: [
            {
              msg:
                `Your Account is locked for ${days} more days`,
            },
          ],
        });
      }


    if (userCreating.inMatch) {
      return res.status(400).json({
        errors: [
          {
            msg:
              'You are already in an ongoing wager. If the wager is completed please make a decision on the outcome of the wager.',
          },
        ],
      });
    }
    const userFeeFree = await checkForFreeWager(userCreating);
    if (amount < MIN_WAGER || amount > MAX_WAGER || isNaN(amount)) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Invalid wager amount. Must be between $1.00 and $300.00',
          },
        ],
      });
    }
    let total = new Big(amount);

    if (total.lt(new Big(3.01))) {
      WAGER_FEE = new Big(0.5);
    } else if (total.lt(new Big(5.01))) {
      WAGER_FEE = new Big(1);
    } else if (total.lt(new Big(15.01))) {
      WAGER_FEE = new Big(2);
    } else if (total.lt(new Big(50.01))) {
      WAGER_FEE = new Big(3);
    } else {
      WAGER_FEE = new Big(4);
    }

        console.log(userFeeFree,'sssss')
        if(userFeeFree === false){
          userCreating.feeFree = false
          total = total.plus(WAGER_FEE);
        }

    

   

    const userBank = await Bank.findOne({ user: userCreating._id });
    let userBankBalance = new Big(userBank.balance);

    if (total.gt(userBankBalance)) {
      return res.status(400).json({
        errors: [
          {
            msg: 'You do not have enough funds. Note: $1 for wager fee.',
          },
        ],
      });
    }

   
    let theStatuses = [];

    let username;

    let verifyEarnings = await yearlyEarningCheck(userCreating.yearlyEarnings, amount, userCreating.taxVerify);
    if (!verifyEarnings){
        return res.status(400).json({
          errors: [
            {
              msg: 'Cannot create or accept wager matches Until SSN and Mailing Address is updated '
            },
          ],
        });
      } 
    



    let areTeamsValid = await verifyTeams(userCreating.username, homeTeam, awayTeam, 'userCreating');
    if (areTeamsValid.message !== 'Success') {
      return res.status(400).json({
        errors: [
          {
            msg: areTeamsValid.message
          },
        ],
      });
    }


    for (let i = 0; i < homeTeam.length; i++) {
      username = homeTeam[i];
      if(username !== userCreating.username){
        theStatuses.push({ user:username, accepted: false });
      }
    }


    for (let i = 0; i < awayTeam.length; i++) {
      username = awayTeam[i];
      theStatuses.push({ user:username, accepted: false });
      
    }

    console.log(theStatuses);


    let updateBankAmount = userBankBalance.minus(total).valueOf();

    console.log(updateBankAmount);

    const type = 'private';

    //set ttl
    var ttl = Date.now();
    let newTTL = new Date(ttl);
    newTTL.setMinutes(newTTL.getMinutes() + 60);
    ttl = newTTL;

    let wagerPot = amount;

    theStatuses.push({ user: userCreating.username, accepted: true });

    let userCreatingCanChat = [];
    userCreatingCanChat.push({
      username: userCreating.username,
      canChat: true,
    });
  
    if(bestOf !== '1'  && bestOf !== '3' ){
      return res.status(400).json({
        errors: [
          {
            msg: 'best of amount is not correct',
          },
        ],
      });
    }

    let wager = new TeamWager({
      userCreating: userCreating.username,
      homeTeam: homeTeam,
      awayTeam: awayTeam,
      game: game,
      bestOf: bestOf,
      amount: amount,
      type: type,
      description: description,
      ttl: ttl,
      wagerPot: wagerPot,
      wagerFee: WAGER_FEE,
      statuses: theStatuses,
      chat: userCreatingCanChat,
      homeTeamDecision: [],
      awayTeamDecision: [],
    });
    console.log(theStatuses);
    console.log(wager.statuses);

    const decision = {
      username: userCreating.username,
    };

    wager.homeTeamDecision.push(decision);

    console.log(wager.statuses);
  

    userCreating.inMatch = true;



    await userCreating.save();
    await wager.save();
    const chat = new Chat({
      wagerid: wager._id,
    });
    await chat.save();
    await Bank.findOneAndUpdate(
      { user: userCreating._id },
      { $set: { balance: updateBankAmount } },
      { new: true }
    );

  
    res.json(wager);
  } catch (err) {
    console.log(err);
  }
});

// @route    POST api/wager
// @desc     Allows a user to create a wager that is visible to everyone else on the site.
// @access   Private

// add a check if player added themselves twice on ateam
router.post('/public', auth, async (req, res) => {
  try {
    const { homeTeam, createTheWager, game, bestOf } = req.body;
    let { amount } = req.body;
    let userCreating = await User.findById(req.user.id).select('username inPublic yearlyEarnings taxVerify locked lockedTTL feeFree won lost');
    const description = createTheWager.description;
    
    // Initialize away team for use in verifyPublicTeams function call
    const awayTeam = [];

    let WAGER_FEE = 0;
    const MIN_WAGER = 1.0;
    const MAX_WAGER = 300.0;

    let date = Date.now();
    let updateDate = date - userCreating.lockedTTL;

    const days = checkedDays(updateDate);

     const checkLocked = checkedLockedUsers(userCreating);
      if(!checkLocked){
        return res.status(400).json({
          errors: [
            {
              msg:
                `Your Account is locked for ${days} more days`,
            },
          ],
        });
      }

    let verifyEarnings = await yearlyEarningCheck(userCreating.yearlyEarnings, amount, userCreating.taxVerify);
    if (!verifyEarnings){
        return res.status(400).json({
          errors: [
            {
              msg: 'Cannot create or accept wager matches Until SSN and Mailing Address is updated '
            },
          ],
        });
      } 
    
    let areTeamsValid = await verifyTeams(userCreating.username, homeTeam, awayTeam, 'userCreating');
    
    if (req.body.game === '') {
      return res.status(400).json({
        errors: [
          {
            msg: 'Please select a game.'
          },
        ],
      });
    }
    
    if (areTeamsValid.message !== 'Success') {
      return res.status(400).json({
        errors: [
          {
            msg: areTeamsValid.message
          },
        ],
      });
    }

    if( description > 250){
      return res.status(400).json({
        errors: [
          {
            msg:
              'Game or description value is too long',
          },
        ],
      });
    }

    
    amount = parseFloat(amount).toFixed(2);

    if (userCreating.inPublic) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Delete the current public wager you have',
          },
        ],
      });
    }

    if (amount < MIN_WAGER || amount > MAX_WAGER || isNaN(amount)) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Invalid wager amount. Must be between $1.00 and $300.00',
          },
        ],
      });
    }

    let total = new Big(amount);
    const userFeeFree = await checkForFreeWager(userCreating);

    if (total.lt(new Big(3.01))) {
      WAGER_FEE = new Big(0.5);
    } else if (total.lt(new Big(5.01))) {
      WAGER_FEE = new Big(1);
    } else if (total.lt(new Big(15.01))) {
      WAGER_FEE = new Big(2);
    } else if (total.lt(new Big(50.01))) {
      WAGER_FEE = new Big(3);
    } else {
      WAGER_FEE = new Big(4);
    }


        if(userFeeFree === false){
          userCreating.feeFree = false
          total = total.plus(WAGER_FEE);
        }
      
 

    const userBank = await Bank.findOne({ user: userCreating._id });
    let userBankBalance = new Big(userBank.balance);

    if (total.gt(userBankBalance)) {
      return res.status(400).json({
        errors: [
          {
            msg: 'You do not have enough funds. Note: $1 for wager fee.',
          },
        ],
      });
    }

    let theStatuses = [];
    let userCreatingCanChat = [];
    let username;

    for (let i = 0; i < homeTeam.length; i++) {
        username = homeTeam[i];
        if (username !== userCreating.username) {
          theStatuses.push({ user: username, accepted: false });
        }
    }

    userCreatingCanChat.push({ username: userCreating.username, canChat: true });

    let updateBankAmount = userBankBalance.minus(total).valueOf();

    const type = 'public';

    //set ttl
    var ttl = Date.now();
    let newTTL = new Date(ttl);
    newTTL.setMinutes(newTTL.getMinutes() + 120);
    ttl = newTTL;

    let wagerPot = amount;

    theStatuses.push({ user: userCreating.username, accepted: true });

    if(bestOf !== '1' && bestOf !== '3' ){
      return res.status(400).json({
        errors: [
          {
            msg: 'best of amount is not correct',
          },
        ],
      });
    };

    let wager = new TeamWager({
      userCreating: userCreating.username,
      homeTeam: homeTeam,
      awayTeam: awayTeam,
      game: game,
      bestOf: bestOf,
      amount: amount,
      type: type,
      description: description,
      ttl: ttl,
      wagerPot: wagerPot,
      wagerFee: WAGER_FEE,
      statuses: theStatuses,
      chat: userCreatingCanChat,
      homeTeamDecision: [],
      awayTeamDecision: [],
    });

    const decision = {
      username: userCreating.username,
    };

    wager.homeTeamDecision.push(decision);

    await Bank.findOneAndUpdate(
      { user: userCreating._id },
      { $set: { balance: updateBankAmount } },
      { new: true }
    );

    userCreating.inPublic = true;



    await userCreating.save();
    await wager.save();


    res.json(wager);
  } catch (err) {
    console.log(err);
  }
});

// @route    POST api/wager
// @desc     Returns user information from database based provided username string
// @access   Public
router.post('/getUserByUsername', auth, async (req, res) => {
  const { username } = req.body;
  console.log(username);
  try {
    let user = await User.findOne({
      username,
    });

    if (!user) {
      return res.status(400).json({
        errors: [
          {
            msg: 'No user for this username.',
          },
        ],
      });
    }
    res.json(user.username);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/wager
// @desc     Gets all wagers from database that user is apart of (either challenger or challengee)
// @access   Private
router.get('/getWagers', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username');

    const wagers = await TeamWager.find({
      $and: [
        {
          $or: [
            { homeTeam: { $eq: user.username } },
            { awayTeam: { $eq: user.username } },
          ],
          statuses: { $elemMatch: { accepted: false, user: user.username } },
          declined: false,
        },
      ],
    });

    res.json(wagers);
    console.log(wagers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/wager
// @desc     Gets all Public wagers
// @access   Private
router.get('/getPublicWagers', auth, async (req, res) => {
  try {
    const user = await User.findById( req.user.id).select('username');
    console.log(user)
    const wagers = await TeamWager.find({
      $and: [{ type: 'public' }, { awayTeam: { $eq: [] } }],
    });
    let updatedWagerArray= [];
    let playerInHomeTeam = false;
    wagers.forEach((wager)=>{
      wager.homeTeam.forEach((player)=>{
        if(user.username === player){
        playerInHomeTeam = true;

        }
      })
        if(!playerInHomeTeam){
        updatedWagerArray.push(wager)
        }
    })
  

    res.json(updatedWagerArray);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/wager
// @desc     Route used for allowing user to accept a wager placed against them
// @access   Private
router.post('/accept', auth, async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id,'iddddd')
    let wager = await TeamWager.findOne({ _id: id });
    const user = await User.findById(req.user.id).select(
      'username inMatch inPublic taxVerify locked lockedTTL yearlyEarnings feeFree won lost'
    );

    const bestOf = wager.bestOf;
    // Verifies that user is not currently in a match\

    let date = Date.now();
    let updateDate = date - user.lockedTTL;

    const days = checkedDays(updateDate);

     const checkLocked = checkedLockedUsers(user);
      if(!checkLocked){
        return res.status(400).json({
          errors: [
            {
              msg:
                `Your Account is locked for ${days} more days`,
            },
          ],
        });
      }

    let verifyEarnings = await yearlyEarningCheck(user.yearlyEarnings, wager.amount, user.taxVerify);
    if (!verifyEarnings){
        return res.status(400).json({
          errors: [
            {
              msg: 'Cannot create or accept wager matches Until SSN and Mailing Address is updated '
            },
          ],
        });
      } 
    


    let isInAMatch = verifyNotInMatch(user, wager.type);

    if (!wager) {
      return res.status(404).json({
        errors: [
          {
            msg: 'Wager has been declined or cancelled.',
          },
        ],
      });
    }

    if (isInAMatch) {
      return res.status(404).json({
        errors: [
          {
            msg: 'You are already in a wager. Please make your decision for that wager before trying to accept this one again.',
          },
        ],
      });
    }

    // Verifies that player is a part of the wager
    let inATeam = isAcceptingPlayerOnATeam(user.username, wager.homeTeam, wager.awayTeam);
    
    if (inATeam === 'fail') {
      return res.status(400).json({
        errors: [
          {
            msg: 'You are not a part of this wager.',
          },
        ],
      });
    }else if(inATeam === 'home'){
      wager.homeTeamDecision.push({username: user.username});
    }else if(inATeam === 'away'){
      wager.awayTeamDecision.push({username: user.username});
    }
      
    let total = new Big(wager.amount);
    const userFeeFree = await checkForFreeWager(user);
    if(userFeeFree === false){
      user.feeFree = false;
      total = total.plus(wager.wagerFee);
    }
   

    // Verify that the user has enough funds in their bank account
    let userHasEnoughFunds = await validateBank(user.id, total.valueOf());
    console.log(userHasEnoughFunds,'iou');
    if (userHasEnoughFunds !== 'Success') {
      return res.status(400).json({
        errors: [
          {
            msg: userHasEnoughFunds
          },
        ],
      });
    }

    // Update user accepting's bank
    let userBank = await Bank.findOne({user: user.id}).select('balance');
    let updateBankAmount = new Big(userBank.balance);
    updateBankAmount = updateBankAmount.minus(total).valueOf();
    userBank.balance = updateBankAmount;
    
    // Added money to wager pot
    let wagerPot = new Big(wager.wagerPot);
    wagerPot = wagerPot.plus(new Big(wager.amount)).valueOf();
    wager.wagerPot = wagerPot;

    for (let i = 0; i < wager.statuses.length; i++) {
      if (wager.statuses[i].user === user.username) {
        wager.statuses[i].accepted = true;
        break;
      }
    }

    wager.chat.push({ username: user.username, canChat: true });

    const totalPlayersToAccept = wager.homeTeam.length * 2;
    const totalPlayerLength = wager.homeTeam.length + wager.awayTeam.length;
    let counter = 0;
    if(wager.awayTeam.length !== 0 ){
      for (let i = 0; i < totalPlayerLength; i++) {
      if (wager.statuses[i].accepted ) {
       counter++; 
      }
    }
  }
    let ttl = Date.now();
    let newTTL = new Date(ttl);
    if (counter === totalPlayersToAccept) {
      wager.status = true;
      if(bestOf === '1'){
        newTTL.setMinutes(newTTL.getMinutes() + 60);
        ttl = newTTL;
        wager.ttl = ttl;
      }
      else if(bestOf === '3'){
        newTTL.setMinutes(newTTL.getMinutes() + 120);
        ttl = newTTL;
        wager.ttl = ttl;
    }
  }
  
    await wager.save();
    await userBank.save();

    if (wager.type === 'public') {
      user.inPublic = true;
    } else {
      user.inMatch = true;
    }


    await user.save();
    res.json(wager);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});
// @route    POST api/wager
// @desc     Route used for allowing user to accept a public wager
// @access   Private
router.post('/acceptPublic', auth, async (req, res) => {
  try {
    // wagerID and awayTeam(can be empty)
    const { id } = req.body;
    let userAccepting = await User.findById(req.user.id).select(
      'username inPublic yearlyEarnings taxVerify locked lockedTTL feeFree won lost'
    );
    let date = Date.now();
    let updateDate = date - userAccepting.lockedTTL;

    const days = checkedDays(updateDate);

     const checkLocked = checkedLockedUsers(userAccepting);
      if(!checkLocked){
        return res.status(400).json({
          errors: [
            {
              msg:
                `Your Account is locked for ${days} more days`,
            },
          ],
        });
      }
    
    let awayTeam;
      // const id = wagerInfo.id;
    if (req.body.awayTeam) {
      awayTeam = req.body.awayTeam;
    } 

    const wager = await TeamWager.findOne({ _id: id });
    const bestOf = wager.bestOf;

    let verifyEarnings = await yearlyEarningCheck(userAccepting.yearlyEarnings, wager.amount, userAccepting.taxVerify);
    if (!verifyEarnings){
        return res.status(400).json({
          errors: [
            {
              msg: 'Cannot create or accept wager matches Until SSN and Mailing Address is updated '
            },
          ],
        });
      } 
    
    // Verify user who is accepting is not already in a public match.
    if (userAccepting.inPublic) {
      return res.status(400).json({
        errors: [
          {
            msg:
              'You are already in an ongoing public wager. If the wager is completed please make a decision on the outcome of the wager.',
          },
        ],
      });
    }
   
    let areTeamsValid = await verifyTeams(userAccepting.username, wager.homeTeam, awayTeam, 'userAccepting');
   
    if (areTeamsValid.message !== 'Success') {
      return res.status(400).json({
        errors: [
          {
            msg: areTeamsValid.message
          },
        ],
      });
    }
   
    // Finalize creation of wager team and build statuses array
        for (let i = 0; i < awayTeam.length; i++) {
         let username = awayTeam[i];
         if(username === userAccepting.username){
          wager.statuses.push({ user: userAccepting.username, accepted: true });
          wager.awayTeam.push(userAccepting.username);
         }else{
           wager.awayTeam.push(username);
          wager.statuses.push({ user: username, accepted: false });
         }
        }
     

      wager.chat.push({ username: userAccepting.username, canChat: true });
      wager.awayTeamDecision.push({username: userAccepting.username});

      let total = new Big(wager.amount);
      const userFeeFree = await checkForFreeWager(userAccepting);
      if(userFeeFree === false){
        userAccepting.feeFree = false;
        total = total.plus(wager.wagerFee);
      }
      

    // Verify that the user has enough funds in their bank account
    let userHasEnoughFunds = await validateBank(userAccepting.id, total);

    if (userHasEnoughFunds !== 'Success') {
      return res.status(400).json({
        errors: [
          {
            msg: userHasEnoughFunds
          },
        ],
      });
    }

    // Update user accepting's bank
    let userAcceptingBank = await Bank.findOne({user: userAccepting.id}).select('balance');
    let updateBankAmount = new Big(userAcceptingBank.balance);
    updateBankAmount = updateBankAmount.minus(total).valueOf();
    userAcceptingBank.balance = updateBankAmount;

   const totalPlayerLength = wager.homeTeam.length + wager.awayTeam.length;
    let wagerIsReady = true;
  
      for (let i = 0; i < totalPlayerLength; i++) {
      if (!wager.statuses[i].accepted ) {
        wagerIsReady = false;
        break;
      }
    }
    let ttl = Date.now();
    let newTTL = new Date(ttl);
    if (wagerIsReady) {
      wager.status = true;
      if(bestOf === '1'){
        newTTL.setMinutes(newTTL.getMinutes() + 60);
        ttl = newTTL;
        wager.ttl = ttl;
      }
      else if(bestOf === '3'){
        newTTL.setMinutes(newTTL.getMinutes() + 120);
        ttl = newTTL;
        wager.ttl = ttl;
    }
  }else{
  newTTL.setMinutes(newTTL.getMinutes() + 30);
  ttl = newTTL;
  wager.ttl = ttl;
  }
  


    userAccepting.inPublic = true;

    await wager.save();
    await userAcceptingBank.save();
    await userAccepting.save();

    res.send(wager);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/wager
// @desc     Route used to allow user to decline a wager placed against them
// @access   Private
router.post('/decline', auth, async (req, res) => {
  const { id } = req.body;
  const user = await User.findById(req.user.id).select('username');
  let wager = await TeamWager.findOne({ _id: id });
  const homeTeam = wager.homeTeam;
  const awayTeam = wager.awayTeam;
  let userHome;
  let userAway;
  let inATeam = false;

  for (let i = 0; i < homeTeam.length; i++) {
    userHome = homeTeam[i];
    userAway = awayTeam[i];

    if (userHome === user.username) {
      inATeam = true;
      break;
    } else if (userAway === user.username) {
      inATeam = true;
      break;
    }
  }
  if (!inATeam) {
    return res.status(400).json({
      errors: [
        {
          msg: 'You are not a part of this wager.',
        },
      ],
    });
  }
  for (let i = 0; i < wager.statuses; i++) {
    if (wager.statuses[i].user === user.username) {
      if (wager.statuses[i].accepted === true) {
        return res.status(400).json({
          errors: [
            {
              msg: 'Cannot decline you have already accepted.',
            },
          ],
        });
      }
    }
  }

  if (wager.status === true) {
    return res.status(500).send('Server error');
  }

  // set ttl to one minute
  var ttl = Date.now();
  let newTTL = new Date(ttl);
  newTTL.setMinutes(newTTL.getMinutes() + 1);
  ttl = newTTL;
  wager.ttl = ttl;
  wager.declined = true;
  await wager.save();
  let playersInTeams = [wager.homeTeam, wager.awayTeam]



  res.json(wager);
});

// @route    POST api/wager
// @desc     Allows user to change their decision about the match to won
// @access   Private
router.post('/won', auth, async (req, res) => {
  try {
    let isCompleted = true;
    const { id } = req.body;
    console.log(id);
    const user = await User.findById(req.user.id).select('username inMatch');
    let wager = await TeamWager.findOne({ _id: id });

    for (let i = 0; i < wager.homeTeam.length; i++) {
      if (wager.homeTeamDecision[i].username === user.username) {
        if (wager.homeTeamDecision[i].decision !== 'unanswered') {
          return res.status(400).json({
            errors: [
              {
                msg: 'you have already made your decision',
              },
            ],
          });
        }
        wager.homeTeamDecision[i].decision = 'won';
        break;
      } else if (wager.awayTeamDecision[i].username === user.username) {
        if (wager.awayTeamDecision[i].decision !== 'unanswered') {
          return res.status(400).json({
            errors: [
              {
                msg: 'you have already made your decision',
              },
            ],
          });
        }
        wager.awayTeamDecision[i].decision = 'won';
        break;
      }
    }
    var ttl = Date.now();
    let newTTL = new Date(ttl);
    newTTL.setMinutes(newTTL.getMinutes() + 1);
    ttl = newTTL;

    for (let i = 0; i < wager.homeTeamDecision.length; i++) {
      if (
        wager.homeTeamDecision[i].decision === 'unanswered' || 
        wager.awayTeamDecision[i].decision === 'unanswered'
      ) {
        isCompleted = false;
        break;
      }
    }
    if (isCompleted) {
      wager.ttl = ttl;
    }
    if(wager.type === 'public'){
user.inPublic = false;
    }else{
      user.inMatch = false;
    }

   

    await user.save();
    await wager.save();
    
    res.send(wager);
  } catch (err) {
    console.log(err);
  }
});

// @route    POST api/wager
// @desc     Allows the user to change their decision about the match to lost
// @access   Private
router.post('/lost', auth, async (req, res) => {
  try {
    let isCompleted = true;
    const { id } = req.body;
    const user = await User.findById(req.user.id).select('username inMatch');
    let wager = await TeamWager.findOne({ _id: id });
  console.log(wager)
    for (let i = 0; i < wager.homeTeam.length; i++) {
      if (wager.homeTeamDecision[i].username === user.username) {
        if (wager.homeTeamDecision[i].decision !== 'unanswered') {
          return res.status(400).json({
            errors: [
              {
                msg: 'you have already made your decision',
              },
            ],
          });
        }
        wager.homeTeamDecision[i].decision = 'lost';
        break;
      } else if (wager.awayTeamDecision[i].username === user.username) {
        if (wager.awayTeamDecision[i].decision !== 'unanswered') {
          return res.status(400).json({
            errors: [
              {
                msg: 'you have already made your decision',
              },
            ],
          });
        }
        wager.awayTeamDecision[i].decision = 'lost';
        break;
      }
    }
    var ttl = Date.now();
    let newTTL = new Date(ttl);
    newTTL.setMinutes(newTTL.getMinutes() + 1);
    ttl = newTTL;

    for (let i = 0; i < wager.homeTeamDecision.length; i++) {
      if (
        wager.homeTeamDecision[i].decision === 'unanswered' &&
        wager.awayTeamDecision[i].decision === 'unanswered'
      ) {
        isCompleted = false;
        break;
      }
    }
    if (isCompleted) {
      wager.ttl = ttl;
    }

    if(wager.type === 'public'){
      user.inPublic = false;
          }else{
            user.inMatch = false;
          }

    await user.save();
    await wager.save();
    res.send(wager);
  } catch (err) {
    console.log(err);
  }
});

// @route    GET api/wager
// @desc     Returns the on going wager a user is a part of
// @access   Private
router.get('/getOngoingWager', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username');

    const onGoingWagers = await TeamWager.find({
      $and: [
        {
          $or: [
            {
              homeTeamDecision: {
                $elemMatch: {
                  username: user.username,
                  decision: { $eq: 'unanswered' },
                },
              },
            },

            {
              awayTeamDecision: {
                $elemMatch: {
                  username: user.username,
                  decision: { $eq: 'unanswered' },
                },
              },
            },
          ],
        },
        { statuses: { $elemMatch: { user: user.username, accepted: true } } },
      ],
    });
    console.log(onGoingWagers);

    res.json(onGoingWagers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route  GET /api/wager
// @desc   Returns all completed wagers that the user is a part of
// @access Private
router.get('/getCompletedWagers', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username');
    const userCompletedWagers = await CompletedWager.find({
      $and:[
        {
      $or: [
        { homeTeam: { $eq: user.username } },
        { awayTeam: { $eq: user.username } },
      ],
    
      result: {$ne: 'cancelled'}
        },
    ],
    });

    res.json(userCompletedWagers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route  GET /api/wager
// @desc   Returns all disputed wagers that a user is a part of
// @access Private
router.get('/getDisputedWagers', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username');
    const userDisputedWagers = await DisputedWager.find({
      $or: [
        { homeTeam: { $eq: user.username } },
        { awayTeam: { $eq: user.username } },
      ],
    });
 
    res.json(userDisputedWagers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



router.post('/cancelWager', auth, async (req, res) => {
  try {
    const { id } = req.body;
    let wager = await TeamWager.findOne({ _id: id });
    const user = await User.findById(req.user.id).select('username');

    if (user.username !== wager.userCreating) {
      return res.status(400).json({
        errors: [
          {
            msg: 'You are not the user who created this wager. ',
          },
        ],
      });
    }

    if (wager.status === true) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Cannot cancel match has been accepted by all players.',
          },
        ],
      });
    }
     
    wager.declined = true;
    var ttl = Date.now();
    let newTTL = new Date(ttl);
    wager.ttl = newTTL;

    await user.save();
    await wager.save();


    res.json(wager);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//get earnings
router.get('/earnings', auth, async (req, res) => {
  try {
    const userEarnings = await User.findById(req.user.id).select('earnings');
    console.log(userEarnings);
    res.json(userEarnings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post(
  '/disputeForm',
  disputeformuploadaws.array('upload', 3),
  auth,
  async (req, res) => {
    try {
      const { id, desc } = req.body;
      let location = [];
      console.log(req.files,'files')
      if (req.files) {
        req.files.forEach((file)=>{
          location.push(file.location);
        })
     
      }
  
      const user = await User.findById(req.user.id).select('username');

      let disputedWager = await DisputedWager.findOne({ _id: id });
      let formStatus= false;
      disputedWager.homeTeamDisputeForms.forEach((player)=>{
      
    
          if(player.username === user.username){
            if(player.status === true){
              formStatus = true;
              return;
            }
            player.status = true;
     
           player.description = desc;
           player.media = location;
          }
      
      })

      disputedWager.awayTeamDisputeForms.forEach((player)=>{
    
     
          if(player.username === user.username){
            if(player.status === true){
              formStatus = true;
              return;
            }
         player.status = true;
          player.description = desc;
          player.media = location;
          }
      
      })

      if(formStatus === true){
        return res.status(400).json({
          errors: [
            {
              msg: 'Already sent in your dispute form',
            },
          ],
        });
      }


      await disputedWager.save();
      res.json(disputedWager);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
