const mongoose = require('mongoose');

const messageStatsSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    index: true
  },
  oderId: {
    type: String,
    required: true,
    index: true
  },
  messages: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound unique index
messageStatsSchema.index({ guildId: 1, oderId: 1 }, { unique: true });

module.exports = mongoose.model('MessageStats', messageStatsSchema);
