const mongoose = require('mongoose');

const modLogSchema = new mongoose.Schema({
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
  username: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['Warn', 'Mute', 'Unmute', 'Kick', 'Ban', 'Unban', 'Timeout']
  },
  moderator: {
    type: String,
    required: true
  },
  moderatorId: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    default: 'No reason provided'
  },
  duration: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
modLogSchema.index({ guildId: 1, oderId: 1 });
modLogSchema.index({ guildId: 1, timestamp: -1 });

module.exports = mongoose.model('ModLog', modLogSchema);
