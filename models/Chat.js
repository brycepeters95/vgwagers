const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  wagerid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'wager',
  },
  messages: [
    {
      text: {
        type: String,
        required: true,
      },
      sender: {
        type: String,
        required: true,
      },
      time: {
        type: Date,
        require: true,
      },
    },
  ],
});

module.exports = Chat = mongoose.model('chat', ChatSchema);
