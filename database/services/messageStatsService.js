const MessageStats = require('../models/MessageStats');

/**
 * Increment message count for a user
 */
async function incrementMessages(guildId, oderId) {
  try {
    await MessageStats.findOneAndUpdate(
      { guildId, oderId },
      { 
        $inc: { messages: 1 },
        $set: { lastUpdated: new Date() }
      },
      { upsert: true }
    );
    return true;
  } catch (error) {
    console.error('Error incrementing messages:', error);
    return false;
  }
}

/**
 * Get message count for a user
 */
async function getMessageCount(guildId, oderId) {
  const stats = await MessageStats.findOne({ guildId, oderId });
  return stats?.messages || 0;
}

/**
 * Get top users by message count (leaderboard)
 */
async function getLeaderboard(guildId, limit = 10) {
  return await MessageStats.find({ guildId })
    .sort({ messages: -1 })
    .limit(limit);
}

/**
 * Get user rank
 */
async function getUserRank(guildId, oderId) {
  const userStats = await MessageStats.findOne({ guildId, oderId });
  if (!userStats) return null;

  const rank = await MessageStats.countDocuments({
    guildId,
    messages: { $gt: userStats.messages }
  });

  return {
    rank: rank + 1,
    messages: userStats.messages
  };
}

/**
 * Reset stats for a guild
 */
async function resetGuildStats(guildId) {
  const result = await MessageStats.deleteMany({ guildId });
  return result.deletedCount;
}

/**
 * Reset stats for a user
 */
async function resetUserStats(guildId, oderId) {
  const result = await MessageStats.deleteOne({ guildId, oderId });
  return result.deletedCount > 0;
}

module.exports = {
  incrementMessages,
  getMessageCount,
  getLeaderboard,
  getUserRank,
  resetGuildStats,
  resetUserStats
};
