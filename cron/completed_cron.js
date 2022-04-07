const TeamWager = require('../models/TeamWager');
const CompletedWager = require('../models/CompletedWager');
const DisputedWager = require('../models/DisputedWager');
const cron_helpers = require('./completed_cron_helpers');

const {
  payUser,
  genTeamAnswer,
  resetInMatch,
  updateWins,
  updateLosses,
  genDisputeForms,
  updateEarnings,
  resetLossDisputesAmount,
  updateGameRecord,
} = require('./completed_cron_helpers');
const User = require('../models/User');

module.exports = {
  cron: function cron(ms, fn) {
    function cb() {
      clearTimeout(timeout);
      timeout = setTimeout(cb, ms);
      fn();
    }
    let timeout = setTimeout(cb, ms);
    return () => {};
  },
  wagersCompleted: async function wagersCompleted() {
    try {
      const currDate = Date.now();
      let completedTTL = new Date(currDate);
      completedTTL = completedTTL.setDate(completedTTL.getDate() + 30);

      const wagers = await TeamWager.find({ ttl: { $lt: currDate } });

      wagers.forEach(async (wager) => {
        try {
          let isDisputed = false;
          let result = 'cancelled';
          if (wager.status === false || wager.declined === true) {
            let status;
            let user;

            for (let i = 0; i < wager.statuses.length; i++) {
              status = wager.statuses[i].accepted;
              user = wager.statuses[i].user;

              if (status) {
                payUser(user, wager.amount, wager.wagerFee, true);
                resetInMatch([user], wager.type);
              }
            }
          } else {
            const homeTeamAnswer = await genTeamAnswer(wager.homeTeamDecision);
            const awayTeamAnswer = await genTeamAnswer(wager.awayTeamDecision);

            /** If hometeam === won and awayteam === lost (pay home team)
             * If awayteam === won and hometeam === lost (pay away team)
             * If home team === won and away team === won (created disputed wager)
             * If home team === lost and away team === lost (pay no one)
             */

            if (homeTeamAnswer === 'won' && awayTeamAnswer === 'lost') {
              result = 'hometeam';
            } else if (awayTeamAnswer === 'won' && homeTeamAnswer === 'lost') {
              result = 'awayteam';
            } else if (homeTeamAnswer === 'won' && awayTeamAnswer === 'won') {
              isDisputed = true;
            }
          }
            if(result !== 'cancelled'){
              wager.homeTeam.forEach(async (user) => {
                if (result === 'hometeam') {
                  payUser(user, wager.amount, 0, false);
                  updateWins(user);
                  updateEarnings(user,wager.amount)
                  updateGameRecord(user, wager.game, 'won', wager.amount)
                } else {
                  updateLosses(user);
                  updateGameRecord(user, wager.game, 'loss', wager.amount)
                }
              });
    
              wager.awayTeam.forEach(async (user) => {
                if (result === 'awayteam') {
                  payUser(user, wager.amount, 0, false);
                  updateWins(user);
                  updateEarnings(user,wager.amount)
                  updateGameRecord(user, wager.game, 'won', wager.amount)
                } else {
                  updateLosses(user);
                  updateGameRecord(user, wager.game, 'loss', wager.amount)
                }
              });
       // reset in match needs changed (will set status to false for all, needs to only set to false for unasnwered decisions)
       resetInMatch(wager.homeTeam, wager.type);
       resetInMatch(wager.awayTeam, wager.type);
            }

          if (isDisputed) {
            let homeTeamDisputeForms = genDisputeForms(wager.homeTeam);
            let awayTeamDisputeForms = genDisputeForms(wager.awayTeam);
            const disputedWager = new DisputedWager({
              wagerid: wager.id,
              userCreating: wager.userCreating,
              homeTeam: wager.homeTeam,
              awayTeam: wager.awayTeam,
              game: wager.game,
              amount: wager.amount,
              description: wager.description,
              date: wager.date,
              type: wager.type,
              status: wager.status,
              time_created: wager.time_created,
              ttl: completedTTL,
              wagerPot: wager.wagerPot,
              awayTeamDecision: wager.awayTeamDecision,
              homeTeamDecision: wager.homeTeamDecision,
              homeTeamDisputeForms: homeTeamDisputeForms,
              awayTeamDisputeForms: awayTeamDisputeForms,
              wagerFee: wager.wagerFee,
            });

      
      

            await disputedWager.save();
            console.log('created');
          } else {
            const completedWager = new CompletedWager({
              userCreating: wager.userCreating,
              homeTeam: wager.homeTeam,
              awayTeam: wager.awayTeam,
              game: wager.game,
              amount: wager.amount,
              description: wager.description,
              date: wager.date,
              type: wager.type,
              status: wager.status,
              time_created: wager.time_created,
              ttl: completedTTL,
              wagerPot: wager.wagerPot,
              awayTeamDecision: wager.awayTeamDecision,
              homeTeamDecision: wager.homeTeamDecision,
              wagerFee: wager.wagerFee,
              declined: wager.declined,
              result: result,
            });
            await completedWager.save();

         
         
    
          }

        
    

          await TeamWager.findByIdAndDelete(wager.id, (err) => {
            if (err) {
              throw err;
            } else {
              console.log('Deleted');
            }
          });
        } catch (err) {
          console.log(err);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },

  resetDisputeLosses: async function resetDisputeLosses() {
    const currDate = Date.now();
    try{
    const users = await User.find({ dateDisputeLoss: { $lt: currDate } })
      users.forEach(async (user) =>{
        try{
          user.disputedLosses = 0;
          user.dateDisputeLoss = Date.now() + 7*24*60*60*1000;
          await user.save();
        }catch(err){
          console.log(err)
        }
      })
    }catch(err){
      console.log(err)
    }
  },
  unlockAccount: async function unlockAccount(){
   const currDate = Date.now();
    try{
    const users = await User.find({
      $and:[{
      dateDisputeLoss: { $lt: currDate },
      locked: true
      }]
    })
      users.forEach(async(user) =>{
        try{
          user.locked = false;
          await user.save();
        }catch(err){
          console.log(err)
        }
      })

    }catch(err){
      console.log(err)
    }
  },

};

