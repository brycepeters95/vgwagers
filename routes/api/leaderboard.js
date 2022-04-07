
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

router.get('/yearlyEarning', async (req,res)=>{
    try{
        const users = await User.find().sort({yearlyEarnings:-1}).select('yearlyEarnings username');
        res.json(users)
    }catch(err){
    console.log(err)
}
})

router.get('/overallEarning', async (req,res)=>{
    try{
        const users = await User.find().sort({earnings:-1}).select('earnings username');
        res.json(users)
    }catch(err){
    console.log(err)
}
})

router.get('/mostWins', async (req,res)=>{
    try{
        console.time('s')
        const users = await User.find().sort({won:-1}).select('won username');
        console.log(users,'d'); 
        res.json(users)
    }catch(err){
    console.log(err)
}
})

router.get('/WLPercentage', async (req,res)=>{
    try{
        const users = await User.find().select('won lost username');
        let listofUsers = []

            for(let i = 0; i<users.length; i++ ){
                let user = users[i]
            
      const winPercentage = user.won/(user.won+ user.lost)*100
      const userWithPercentage = {username: user.username, winPercentage:winPercentage}
      if(isNaN(userWithPercentage.winPercentage)){
      userWithPercentage.winPercentage = 0;
      listofUsers.push(userWithPercentage)
      }else{
      listofUsers.push(userWithPercentage)
      }
    }
      let updatedListOfUsers = listofUsers.sort((a,b)=> parseFloat(b.winPercentage)- parseFloat(a.winPercentage))
        console.log(updatedListOfUsers)

        res.send(updatedListOfUsers);
    }catch(err){
    console.log(err)
}
});

router.post('/byGame', async(req,res) =>{
    const {game, type} = req.body
    try{
        const users = await User.find({gameRecord:  {$elemMatch : { game: game }}}).select('gameRecord username');   
        let usersBasedOnGame = []
        for(let i = 0; i< users.length; i++){  
          for(let j = 0; j < users[i].gameRecord.length; j++){
        console.log(users[j].gameRecord.length,'f')
            if(game === users[i].gameRecord[j].game){
        const winPercentage = users[i].gameRecord[j].wins/(users[i].gameRecord[j].wins+ users[i].gameRecord[j].loss)*100
                let userRecord = {
                username: users[i].username,
                game: users[i].gameRecord[j].game,
                wins: users[i].gameRecord[j].wins,
                loss: users[i].gameRecord[j].loss,
                earnings: users[i].gameRecord[j].earnings,
                WLPercentage: winPercentage
                }
               
                usersBasedOnGame.push(userRecord)
                }
          }
        }
        if(type === 'overallEarnings'){
     usersBasedOnGame = usersBasedOnGame.sort((a,b)=> (b.earnings)- (a.earnings));
        }else if(type === 'WLPercentage'){
     usersBasedOnGame = usersBasedOnGame.sort((a,b)=> parseFloat(b.WLPercentage)- parseFloat(a.WLPercentage));
        }else if(type === 'overallWins'){
    usersBasedOnGame = usersBasedOnGame.sort((a,b)=> (b.wins) - (a.wins));
        }
       
        console.log(usersBasedOnGame);
        res.json(usersBasedOnGame);

    }catch(err){
        console.log(err)
    }
})

module.exports = router