const mongoose = require('mongoose');

const PasswordResetSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
      },
      urlparam: {
          type: String,
          required: true
      },
      ttl: {
          type: Date,
          required: true
      }

});

module.exports = PasswordReset = mongoose.model('passwordreset', PasswordResetSchema);