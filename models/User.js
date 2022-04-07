const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },

  date: {
    type: Date,
    default: Date.now,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  won: {
    type: Number,
    default: 0,
  },
  lost: {
    type: Number,
    default: 0,
  },
  gameRecord: [
      {
        game: {
          type: String,
          required: true,
        },
        wins:{
          type:Number,
          default:0
        },
        loss: {
          type:Number,
          default:0
        },
        earnings: {
          type:Number,
          default:0
        },
      },
    ],
  earnings: {
    type: Number,
    default: 0,
  },
  yearlyEarnings:{
    type:Number,
    default: 0
  },
  inMatch: {
    type: Boolean,
    default: false,
  },
  inPublic: {
    type: Boolean,
    default: false,
  },
  disputedLosses:{
    type: Number,
    default:0
  },
  dateDisputeLosses:{
    type: Date,
    default: Date.now() + 7*24*60*60*1000
  },
  locked:{
    type:Boolean,
    default:false
  },
  lockedTTL:{
    type:Date,
    default: Date.now()
  },
  feeFree:{
      type:Boolean,
      default:true
  }


});

module.exports = User = mongoose.model('user', UserSchema);
