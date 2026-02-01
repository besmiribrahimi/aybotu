// Export all services from a single file for easy importing
const guildConfigService = require('./guildConfigService');
const autoResponderService = require('./autoResponderService');
const modLogService = require('./modLogService');
const messageStatsService = require('./messageStatsService');
const giveawayService = require('./giveawayService');
const ticketService = require('./ticketService');

module.exports = {
  ...guildConfigService,
  ...autoResponderService,
  ...modLogService,
  ...messageStatsService,
  ...giveawayService,
  ...ticketService
};
