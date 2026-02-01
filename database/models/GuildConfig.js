const mongoose = require('mongoose');

const guildConfigSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  // Welcome/Leave settings
  welcomeChannelId: {
    type: String,
    default: null
  },
  leaveChannelId: {
    type: String,
    default: null
  },
  // Log settings
  logChannelId: {
    type: String,
    default: null
  },
  // Help channel
  helpChannelId: {
    type: String,
    default: null
  },
  // Modlog channel
  modlogChannelId: {
    type: String,
    default: null
  },
  // Ticket settings
  ticketCategoryId: {
    type: String,
    default: null
  },
  ticketCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GuildConfig', guildConfigSchema);
