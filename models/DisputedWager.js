const mongoose = require('mongoose');

const WagerSchema = new mongoose.Schema({
  wagerid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userCreating: {
    type: String,
    required: true,
  },
  homeTeam: [
    {
      type: String,
    },
  ],
  awayTeam: [
    {
      type: String,
    },
  ],
  game: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String, // public or private
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
  time_created: {
    type: Date,
    default: Date.now,
    required: true,
  },
  ttl: {
    type: Date,
    required: true,
  },
  wagerPot: {
    type: Number,
    default: 0,
    required: true,
  },
  awayTeamDecision: [
    {
      username: {
        type: String,
        required: true,
      },
      decision: {
        type: String,
        default: 'unanswered',
      },
    },
  ],
  homeTeamDecision: [
    {
      username: {
        type: String,
        required: true,
      },
      decision: {
        type: String,
        default: 'unanswered',
      },
    },
  ],
  wagerFee: {
    type: Number,
    required: true,
  },

  // make sure backend to add condition to change disputeform.status to true if form was filled out
  homeTeamDisputeForms: [
    {
      username: {
        type: String,
        required: true
      },
      status: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
        default: '',
      },
      media: [
        {
        type: String,
        default: '',
        }
      ]
      
    },
  ],
  awayTeamDisputeForms: [
    {
      username: {
        type: String,
      },
      status: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
        default: '',
      },
      media:[
         {
        type: String,
        default: '',
      },
    ]
    },
  ],
  //status, ttl, created
});

module.exports = DisputedWager = mongoose.model('disputedwager', WagerSchema);
