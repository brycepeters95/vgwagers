const User = require('../../models/User');
const TeamWager = require('../../models/TeamWager');
const Big = require('big.js');
const { async } = require('crypto-random-string');

module.exports = {
    verifiyAmount: function (amount){
        const MIN_WAGER = 1;
        const MAX_WAGER = 300;
      
        if (amount < MIN_WAGER || amount > MAX_WAGER || isNaN(amount)) {
            return 'Success'
        } else {
            return 'Invalid wager amount (must be between $1 and $300)'
        }
    },
    genFee: function (amount) {
        let bigAmount = new Big(amount);

        if (bigAmount.lt(new Big(3.01))) {
            return new Big(0.5);
        } else if (bigAmount.lt(new Big(5.01))) {
            return new Big(1);
        } else if (bigAmount.lt(new Big(15.01))) {
            return new Big(2);
        } else if (bigAmount.lt(new Big(50.01))) {
            return new Big(3);
        } else {
            return new Big(4);
        }
    },
    validateBank: async (userId, totalAmount) => {
        try {
            const userBank = await Bank.findOne({ user: userId});
            let userBankBalance = new Big(userBank.balance);
            let bigTotalAmount = new Big(totalAmount);
            if (bigTotalAmount.gt(userBankBalance)) {
                return "Not enough funds."
            } else {
                return "Success"
            }

        } catch (err) {
            console.log(err);
            return "Error."
        }
    },
    verifyTeams: async (initalUser, homeTeam, awayTeam, userType) => {
        try {
            let user;
            let username;
            let verified; // Object to return (error: true/false, message: "string")
            let verifiedHomeTeam = [];
            let verifiedAwayTeam = [];
            
            if (userType === 'userCreating') {
                homeTeam.push(initalUser);
            } else if (userType === 'userAccepting') {
                awayTeam.push(initalUser);
            }
            
            const homeTeamLength = homeTeam.length;
            const awayTeamLength = awayTeam.length;

            if (initalUser === null) {
                return verified = {
                    errors: true,
                    message: 'Invalid team structure.'
                }
            }

            if (homeTeamLength < 1 ) {
                return verified = {
                    errors: true,
                    message: 'Invalid team length.'
                }
            } else if (homeTeamLength > 6) {
                return verified = {
                    errors: true,
                    message: 'Invalid team length.'
                }
            }

            for (let i = 0; i < homeTeamLength; i++) {
                user = homeTeam[i];
                username = await User.findOne({ username: user }).select('username');
                if (!username) {
                  return verified = {
                      errors: true,
                      message: `User ${user} does not exist.`
                  }
                }

                for (let x = i + 1; x < homeTeamLength; x++) {
                    if (homeTeam[x] === user) {
                        return verified = {
                            errors: true,
                            message: `Duplicate user on home team: ${user}.`
                        }
                    } 
                }

                verifiedHomeTeam.push(user);

            }
       
            if (awayTeamLength === 0) {
                return verified = {
                    errors: false,
                    message: 'Success'
                }
            }
            
            if (awayTeamLength < 1 ) {
                return verified = {
                    errors: true,
                    message: 'Invalid team length.'
                }
            } else if (awayTeamLength > 6) {
                return verified = {
                    errors: true,
                    message: 'Invalid team length.'
                }
            }

            if (homeTeamLength !== awayTeamLength) {
                return verified = {
                    errors: true,
                    message: 'The teams are unbalanced.'
                }
            }

            for (i = 0; i < awayTeamLength; i++) {
                user = awayTeam[i];
                username = await User.findOne({ username: user }).select('username');
                if (!username) {
                    return verified = {
                        errors: true,
                        message: `User ${user} does not exist.`
                    }
              }
              for ( x = i + 1; x < awayTeamLength; x++) {
                 if (awayTeam[x] === user) {
                        return verified = {
                            errors: true,
                            message: `Duplicate user on away team: ${user}.`
                        }
                    } 
               }
               verifiedAwayTeam.push(user); 
            }
            
            for (i = 0; i < verifiedHomeTeam.length; i++) {
                let userHome = verifiedHomeTeam[i];
                for (x = 0; x < verifiedAwayTeam.length; x++) { 
                    if (userHome === verifiedAwayTeam[x]) {
                        return verified = {
                            errors: true,
                            message: `User ${userHome} cannot be on both teams.`
                        }
                    }
                }
            }

            return verified = {
                errors: false,
                message: 'Success'
            }

        } catch (err) {
          console.log(err);
          return verifed = {
              errors: true,
              message: err
          }
        }
    },
    genStatuses: function (userCreating, homeTeam, awayTeam) {
        let theStatuses = [];

        theStatuses.push({ user: userCreating, accepted: true});

        homeTeam.forEach( (user) =>  {
            theStatuses.push({ user: user, accepted: false });
        });

        if (awayTeam === null) {
            return theStatuses;
        }

        awayTeam.forEach( (user) => {
            theStatuses.push({ user: username, accepted: false });
        });

        return theStatuses;
    },

    isAcceptingPlayerOnATeam: function (username, homeTeam, awayTeam) {
   
        let team = 'fail';
        homeTeam.forEach( (user) =>  {
            if (user === username) {
              
                team = 'home';
            }
        });

        awayTeam.forEach( (user) => {
            if (user === username) {
          
               team = 'away';
            }
        });

        return team;
    },

    verifyNotInMatch: function (user, wagerType) {
        let isInAMatch = false; 

        if (wagerType === 'private') {
            if (user.inMatch === true) {
                isInAMatch = true;
            }
        } else if (wagerType === 'public') {
            if (user.inPublic === true) {
                isInAMatch = true;
            }
        }

        return isInAMatch;
    },
    notInHomeTeam: function (wager, awayTeam) {

        for (let i = 0; i < wager.homeTeam.length; i++) {
            let userInHomeTeam = wager.homeTeam[i];
            for (let x = 0; i < wager.awayTeam.length; x++) {
                let userInAwayTeam = awayTeam[x];
                if (userInAwayTeam === userInHomeTeam) {
                    return `${awayTeam[i]} is alreay apart of the home team.`;
                }
            } 
        }
        return 'Success';  
    },
    doesUserExist: async function (awayTeam) {
        try {
            for (let i = 0;i < awayTeam.length; i++) {
               
                let username = awayTeam[i];
                let user =await User.findOne({username: username});

                if (!user) {
                    return `${username} is not the name of a registered account.`
                } 
            }
            return 'Success';
        } catch (err) {
            console.log (err);
        }
    },
    yearlyEarningCheck: async function(userYearlyEarnings, amount, userTaxVerify) {
        console.log(userYearlyEarnings,'sd')
        try{
            if(userTaxVerify === true){
                return true;
            }

            const bigUserEarnings = new Big(userYearlyEarnings);
            const MAXEARNINGS = new Big(599.99);
            const bigWagerAmount = new Big(amount);
            const totalEarningsAfterAction = bigUserEarnings.plus(bigWagerAmount);

            if( totalEarningsAfterAction.gt(MAXEARNINGS)){
                return false;
            } else {
                return true;
            }
        } catch (err) {
            console.log (err);
        }
    },
    getTheTaxMessage: async function(taxPending,taxVerify){
        console.log(taxVerify,taxPending,'ff')
        try{
            if(taxVerify === false && taxPending === false){
                  return taxMessage = 'Please Verify these correct tax information'
                }else if (taxPending === true && taxVerify === false){
                return  taxMessage ='tax Verfication Pending'
                }else{
                return  taxMessage ='Tax Verification Accepted'
                }
        }catch(err){
            console.log(err)
        }
    },
    checkedLockedUsers: function(user){
    try{
        console.log(user, 'f');
        if(user.locked === true){
            return false;
        }else{
        return true;
        }
    }catch(err){
        console.log(err)
    }
    },
    checkedDays: async function(time){
        console.log(time);
           
                let days = (time / (1000 * 60 * 60 * 24)).toFixed(1);
                return days
              
        
    },
    checkForFreeWager: async function(user){
        console.log(user,'userrrrrr');
        if(user.won + user.lost > 4){
            return false;
          
        }else{
            return true;
        }
       
    }
};


   