const Ticket = require('../models/Ticket');
const { incrementTicketCount } = require('./guildConfigService');

/**
 * Create a new ticket
 */
async function createTicket(guildId, channelId, oderId) {
  try {
    const ticketNumber = await incrementTicketCount(guildId);
    
    const ticket = await Ticket.create({
      guildId,
      channelId,
      oderId,
      ticketNumber,
      status: 'open'
    });
    
    return ticket;
  } catch (error) {
    console.error('Error creating ticket:', error);
    return null;
  }
}

/**
 * Get ticket by channel ID
 */
async function getTicketByChannel(channelId) {
  return await Ticket.findOne({ channelId });
}

/**
 * Get all open tickets for a guild
 */
async function getOpenTickets(guildId) {
  return await Ticket.find({ guildId, status: 'open' });
}

/**
 * Get all tickets for a user
 */
async function getUserTickets(guildId, oderId) {
  return await Ticket.find({ guildId, oderId });
}

/**
 * Close a ticket
 */
async function closeTicket(channelId, closedBy) {
  try {
    await Ticket.updateOne(
      { channelId },
      { 
        $set: { 
          status: 'closed',
          closedAt: new Date(),
          closedBy 
        } 
      }
    );
    return true;
  } catch (error) {
    console.error('Error closing ticket:', error);
    return false;
  }
}

/**
 * Delete a ticket record
 */
async function deleteTicket(channelId) {
  const result = await Ticket.deleteOne({ channelId });
  return result.deletedCount > 0;
}

/**
 * Check if user has an open ticket
 */
async function hasOpenTicket(guildId, oderId) {
  const ticket = await Ticket.findOne({ guildId, oderId, status: 'open' });
  return ticket !== null;
}

module.exports = {
  createTicket,
  getTicketByChannel,
  getOpenTickets,
  getUserTickets,
  closeTicket,
  deleteTicket,
  hasOpenTicket
};
