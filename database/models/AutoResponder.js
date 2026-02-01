const mongoose = require('mongoose');

const autoResponderSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    index: true
  },
  trigger: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  exactMatch: {
    type: Boolean,
    default: false
  },
  embedResponse: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for faster lookups
autoResponderSchema.index({ guildId: 1, trigger: 1 }, { unique: true });

module.exports = mongoose.model('AutoResponder', autoResponderSchema);
