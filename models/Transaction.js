const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  id: {
      type: String,
      required: true
  }
});

module.exports = Transaction = mongoose.model('transaction', TransactionSchema);
