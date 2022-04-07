
const express = require('express');

const completed_cron = require('./cron/completed_cron');

const path = require('path');

const Chat = require('./models/Chat');
const cors = require('cors')



//const fileUpload =require('express-fileupload');
const connectDB = require('./config/db');

//connect app to express server
const app = express();
app.use(cors())
// app.use(methodOverride('_method'));
// Connect Database
connectDB();

// Init Middleware(body parser)
app.use(
  express.json({
    extended: false,
  })
);

if(process.env.NODE_ENV ==='production'){
  app.use(express.static('client/build'))
}

// app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

//test end point
app.get('/', (req, res) => res.send('api running'));

//cron.cron(10000, () => cron.findAndDeleteCompletedWagers());
completed_cron.cron(5000, () => completed_cron.wagersCompleted());
completed_cron.cron(10000, () => completed_cron.resetDisputeLosses());
completed_cron.cron(10000, () => completed_cron.unlockAccount());
//cron.cron(10000, () => cron.batchPayout());

// Define Routes so we can access routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/bank', require('./routes/api/bank'));
app.use('/api/wager', require('./routes/api/wager'));
app.use('/api/leaderboard', require('./routes/api/leaderboard'));



//look for environment variable(heroku) if none run on port 5000
const PORT = process.env.PORT || 5000;




// console.log(client);
// Initialize https server
// var server = https.createServer(options, app);

//pass in port then do a call back stating the server started on that port
const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);
const socket = require('socket.io');
const io = socket(server,{
  handlePreflightRequest: (req, res) => {
    const headers = {
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
        "Access-Control-Allow-Credentials": true
    };
    res.writeHead(200, headers);
    res.end();
  }
});

io.on('connection', (socket) => {
 
  console.log(`Connected: ${socket.id}`);

  socket.on('setUser', function(data){
    console.log(data)
    const socketId = socket.id.toString()
    const username= data.userId;
    console.log(socketId, 'sid', username, 'user')
})



  socket.on('disconnect', () => 
  console.log(`Disconnected: ${socket.id}`));

  socket.on('join', async (room) => {
    console.log(`Socket ${socket.id} joining ${room}`);
    socket.join(room);

    let chat = await Chat.findOne({ wagerid: room });
    console.log(chat);

    if (chat.messages !== null) {
      const messages = chat.messages;
      io.to(room).emit('oldchat', messages);
    }
  });


  socket.on('send Message', async (data) => {
    try {
      console.log(data);
      let chat = await Chat.findOne({ wagerid: data.room });
      console.log(data.room);

      const message = {
        sender: data.username,
        text: data.themessage,
        time: Date.now(),
      };

      await chat.messages.push(message);
      await chat.save();
      let updatedMessages = chat.messages;
      io.emit('message', updatedMessages);
    } catch (err) {
      console.log(err);
    }
  });
});
