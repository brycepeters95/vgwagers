const mongoose = require('mongoose');

const VerifySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
      stringforuser:{
          type:String
      }

});

module.exports = Verify = mongoose.model('verify', VerifySchema);