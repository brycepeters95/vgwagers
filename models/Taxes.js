const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
      fullName : {
        type:String,
        required:true
      },
      ssn:{
          type: String,
          required:true
      },
      mailingAddress:{
          type: String,
          required: true
      },
      taxPending:{
        type:Boolean,
        default:false
      },
       taxVerify:{
         type:Boolean,
         default: false
       }

});

module.exports = TAX = mongoose.model('tax', taxSchema);