const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    index: true
  },
  channelId: {
    type: String,
    required: true,
    unique: true
  },
  oderId: {
    type: String,
    required: true
  },
  ticketNumber: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  closedAt: {
    type: Date,
    default: null
  },
  closedBy: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for finding open tickets
ticketSchema.index({ guildId: 1, status: 1 });
ticketSchema.index({ guildId: 1, oderId: 1 });

module.exports = mongoose.model('Ticket', ticketSchema);
