const GuildConfig = require('../models/GuildConfig');

/**
 * Get or create guild configuration
 */
async function getGuildConfig(guildId) {
  let config = await GuildConfig.findOne({ guildId });
  if (!config) {
    config = await GuildConfig.create({ guildId });
  }
  return config;
}

/**
 * Update guild configuration
 */
async function updateGuildConfig(guildId, updates) {
  return await GuildConfig.findOneAndUpdate(
    { guildId },
    { $set: updates },
    { upsert: true, new: true }
  );
}

/**
 * Set welcome channel
 */
async function setWelcomeChannel(guildId, channelId) {
  return await updateGuildConfig(guildId, { welcomeChannelId: channelId });
}

/**
 * Set leave channel
 */
async function setLeaveChannel(guildId, channelId) {
  return await updateGuildConfig(guildId, { leaveChannelId: channelId });
}

/**
 * Set log channel
 */
async function setLogChannel(guildId, channelId) {
  return await updateGuildConfig(guildId, { logChannelId: channelId });
}

/**
 * Set help channel
 */
async function setHelpChannel(guildId, channelId) {
  return await updateGuildConfig(guildId, { helpChannelId: channelId });
}

/**
 * Set modlog channel
 */
async function setModlogChannel(guildId, channelId) {
  return await updateGuildConfig(guildId, { modlogChannelId: channelId });
}

/**
 * Increment ticket count and return new count
 */
async function incrementTicketCount(guildId) {
  const config = await GuildConfig.findOneAndUpdate(
    { guildId },
    { $inc: { ticketCount: 1 } },
    { upsert: true, new: true }
  );
  return config.ticketCount;
}

module.exports = {
  getGuildConfig,
  updateGuildConfig,
  setWelcomeChannel,
  setLeaveChannel,
  setLogChannel,
  setHelpChannel,
  setModlogChannel,
  incrementTicketCount
};
