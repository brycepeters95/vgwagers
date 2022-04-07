const mongoose = require('mongoose');

const PayoutSchema = new mongoose.Schema({
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'user'
},
username:{
    type:String,
    required: true
},
email: {
    type: String,
    required: true
},
amount: {
    type: Number,
    required: true
},
currency_code: {
    type: String,
    default: 'USD'
},
confirm:{
type: Boolean,
default: false
}

  
});

module.exports = Wallet = mongoose.model('payout', PayoutSchema);
