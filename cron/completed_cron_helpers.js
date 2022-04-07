const User = require('../models/User');
const Bank = require('../models/Bank');
const Big = require('big.js');

module.exports = {
  payUser: async function (username, amount, fee, isCancelled) {
    //fee = fee || 0;
    let bigFee;
    if (fee !== 0) {
      bigFee = new Big(fee);
    }

    try {
      const user = await User.findOne({ username: username }).select(
        'username feeFree'
      );

      let userBank = await Bank.findOne({ user: user.id }).select('balance');

      let bigAmount = new Big(amount);

      // If wager hasn't been cancelled double amount for pay out
      if (!isCancelled) {
        bigAmount = bigAmount.times(2); // Double wager amount to pay user their wager plus one from other team
      }

      let bigBalance = new Big(userBank.balance);
      let total = new Big(0);

      if (fee !== 0 && user.feeFree === false) {
        total = total.plus(bigFee);
      }

      total = total.plus(bigAmount);
      bigBalance = bigBalance.plus(total);

      userBank.balance = bigBalance.valueOf();

      await userBank.save();
    } catch (err) {
      console.log(err);
    }
  },
  resetInMatch: async function (team, type) {
    let user;

    for (let i = 0; i < team.length; i++) {
      if (type === 'public') {
        user = await User.findOne({ username: team[i] }).select('inPublic');
        user.inPublic = false;
      } else {
        user = await User.findOne({ username: team[i] }).select('inMatch');
        user.inMatch = false;
      }
      await user.save();
    }
  },
  genTeamAnswer: async function (teamAnswers) {
    let wins = 0;
    let loses = 0;
    let decision;

    for (let i = 0; i < teamAnswers.length; i++) {
      decision = teamAnswers[i].decision;

      if (decision === 'won') {
        wins = wins + 1;
      } else if (decision === 'lost') {
        loses = loses + 1;
      } else {
        loses = loses + 1;
      }
    }

    if (wins > loses) {
      return 'won';
    } else if (loses > wins) {
      return 'lost';
    } else {
      return 'won';
    }
  },
  updateWins: async function (username) {
    const user = await User.findOne({ username: username }).select('won');
    let userWins = user.won;

    userWins = userWins + 1;
    user.won = userWins;

    await user.save();
  },
  updateLosses: async function (username) {
    const user = await User.findOne({ username: username }).select('lost');
    let userLosses = user.lost;

    userLosses = userLosses + 1;
    user.lost = userLosses;

    await user.save();
  },
  genDisputeForms: function (team) {
    let disputeForms = [];
    team.forEach((member) => {
      let disputeForm = {
        username: member,
        status: false,
        description: '',
        media: '',
      };
      disputeForms.push(disputeForm);
    });
    return disputeForms;
  },

  updateEarnings: async function (username, amount) {
    const user = await User.findOne({ username: username }).select('earnings');
    let userEarnings = new Big(user.earnings);
    const BigAmount = new Big(amount);
    
    userEarnings = userEarnings.plus(BigAmount);
    user.earnings = userEarnings;
      console.log(user.earnings,'UE')
    await user.save();
  },

  
  updateGameRecord: async function(username, game, decision, amount){
    const user = await User.findOne({username: username }).select('gameRecord');
    let found = false;
    if(user.gameRecord.length === 0){
      let record = {game: game, wins: 0, loss: 0, earnings: 0 };
      if(decision === 'won'){
        record.wins += 1
        record.earnings += amount
      }else{
        record.loss += 1;
      }
      user.gameRecord.push(record)
    }else{
      console.log('hit')
      for(let i = 0; i< user.gameRecord.length; i++){
        let record = user.gameRecord[i]; 
        console.log(record,'hit2')
        if(record.game === game){
          console.log('hit3')
          found = true;
        if (decision === 'won'){
          console.log('hit4')
          record.wins += 1;
          record.earnings += amount;
        }else{
          record.loss += 1;
        }
      } 
    }
    if(!found){
      console.log('hit5')
      let record = {game: game, wins: 0, loss: 0, earnings: 0 };
      if(decision === 'won'){
        record.wins += 1
        record.earnings += amount
      }else{
        record.loss += 1;
      }
      user.gameRecord.push(record)
    }
    }
   
      await user.save();
  }

};

