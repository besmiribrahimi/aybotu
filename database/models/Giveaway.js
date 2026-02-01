const mongoose = require('mongoose');

const giveawaySchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    index: true
  },
  channelId: {
    type: String,
    required: true
  },
  messageId: {
    type: String,
    required: true,
    unique: true
  },
  prize: {
    type: String,
    required: true
  },
  winners: {
    type: Number,
    default: 1
  },
  endsAt: {
    type: Date,
    required: true,
    index: true
  },
  hostId: {
    type: String,
    required: true
  },
  hostTag: {
    type: String,
    required: true
  },
  participants: [{
    type: String
  }],
  ended: {
    type: Boolean,
    default: false
  },
  winnerIds: [{
    type: String
  }]
}, {
  timestamps: true
});

// Index for finding active giveaways
giveawaySchema.index({ ended: 1, endsAt: 1 });

module.exports = mongoose.model('Giveaway', giveawaySchema);
