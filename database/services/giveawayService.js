const Giveaway = require('../models/Giveaway');

/**
 * Create a new giveaway
 */
async function createGiveaway(data) {
  try {
    const giveaway = await Giveaway.create({
      guildId: data.guildId,
      channelId: data.channelId,
      messageId: data.messageId,
      prize: data.prize,
      winners: data.winners || 1,
      endsAt: data.endsAt,
      hostId: data.hostId,
      hostTag: data.hostTag,
      participants: [],
      ended: false
    });
    return giveaway;
  } catch (error) {
    console.error('Error creating giveaway:', error);
    return null;
  }
}

/**
 * Get a giveaway by message ID
 */
async function getGiveaway(messageId) {
  return await Giveaway.findOne({ messageId });
}

/**
 * Get all active giveaways
 */
async function getActiveGiveaways() {
  return await Giveaway.find({ ended: false });
}

/**
 * Get active giveaways for a guild
 */
async function getGuildGiveaways(guildId) {
  return await Giveaway.find({ guildId, ended: false });
}

/**
 * Add participant to giveaway
 */
async function addParticipant(messageId, oderId) {
  try {
    const giveaway = await Giveaway.findOne({ messageId });
    if (!giveaway || giveaway.ended) return false;
    
    if (!giveaway.participants.includes(oderId)) {
      await Giveaway.updateOne(
        { messageId },
        { $push: { participants: oderId } }
      );
    }
    return true;
  } catch (error) {
    console.error('Error adding participant:', error);
    return false;
  }
}

/**
 * Remove participant from giveaway
 */
async function removeParticipant(messageId, oderId) {
  try {
    await Giveaway.updateOne(
      { messageId },
      { $pull: { participants: oderId } }
    );
    return true;
  } catch (error) {
    console.error('Error removing participant:', error);
    return false;
  }
}

/**
 * End a giveaway
 */
async function endGiveaway(messageId, winnerIds = []) {
  try {
    await Giveaway.updateOne(
      { messageId },
      { 
        $set: { 
          ended: true,
          winnerIds 
        } 
      }
    );
    return true;
  } catch (error) {
    console.error('Error ending giveaway:', error);
    return false;
  }
}

/**
 * Delete a giveaway
 */
async function deleteGiveaway(messageId) {
  const result = await Giveaway.deleteOne({ messageId });
  return result.deletedCount > 0;
}

/**
 * Get giveaways that should end
 */
async function getExpiredGiveaways() {
  return await Giveaway.find({
    ended: false,
    endsAt: { $lte: new Date() }
  });
}

module.exports = {
  createGiveaway,
  getGiveaway,
  getActiveGiveaways,
  getGuildGiveaways,
  addParticipant,
  removeParticipant,
  endGiveaway,
  deleteGiveaway,
  getExpiredGiveaways
};
