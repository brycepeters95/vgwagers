const mongoose = require('mongoose');

//array of anything would be like type:[string]
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },

  bio: {
    type: String,
  },
  social: {
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  gamertags: {
    pc: {
      type: String,
    },
    xbox: {
      type: String,
    },
    playstation: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
