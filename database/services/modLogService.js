const ModLog = require('../models/ModLog');
const { getGuildConfig } = require('./guildConfigService');

/**
 * Add a moderation action log
 */
async function addModAction(data) {
  try {
    const modLog = await ModLog.create({
      guildId: data.guildId,
      oderId: data.oderId,
      username: data.username,
      action: data.action,
      moderator: data.moderator,
      moderatorId: data.moderatorId,
      reason: data.reason || 'No reason provided',
      duration: data.duration || null
    });
    return modLog;
  } catch (error) {
    console.error('Error adding mod action:', error);
    return null;
  }
}

/**
 * Get all mod actions for a user in a guild
 */
async function getUserModHistory(guildId, oderId) {
  return await ModLog.find({ guildId, oderId }).sort({ timestamp: -1 });
}

/**
 * Get recent mod actions for a guild
 */
async function getGuildModHistory(guildId, limit = 50) {
  return await ModLog.find({ guildId }).sort({ timestamp: -1 }).limit(limit);
}

/**
 * Get modlog channel for a guild
 */
async function getModlogChannel(guildId) {
  const config = await getGuildConfig(guildId);
  return config?.modlogChannelId || null;
}

/**
 * Count warnings for a user
 */
async function getWarningCount(guildId, oderId) {
  return await ModLog.countDocuments({ guildId, oderId, action: 'Warn' });
}

/**
 * Clear warnings for a user
 */
async function clearWarnings(guildId, oderId) {
  const result = await ModLog.deleteMany({ guildId, oderId, action: 'Warn' });
  return result.deletedCount;
}

module.exports = {
  addModAction,
  getUserModHistory,
  getGuildModHistory,
  getModlogChannel,
  getWarningCount,
  clearWarnings
};
