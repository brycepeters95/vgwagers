const mongoose = require('mongoose');

const WagerSchema = new mongoose.Schema({
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
  declined: {
    type: Boolean,
    default: false,
  },
  result: {
    // Winning team, either home team or away team.
    type: String,
    required: true,
  },
});

module.exports = TeamWager = mongoose.model('completedwager', WagerSchema);
