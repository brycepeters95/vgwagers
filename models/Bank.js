const mongoose = require('mongoose');

const BankSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  balance: {
    type: Number,
    default: 0
  },
  transactions: [
    {
      id: {
        type: String
      },
      type: {
        type: String
      },
      amount: {
        type: Number
      },
      date: {
        type: Date
      },
      confirm:{
      type: Boolean,
      default:false
      },
    }
  ],
  limit: {
    type: Number,
    default: 0,
  },
  time: {
    type:Date
  }
});

module.exports = Bank = mongoose.model('bank', BankSchema);
