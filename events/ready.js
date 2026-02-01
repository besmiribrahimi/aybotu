const giveawayScheduler = require('../utils/giveawayScheduler.js');

module.exports = {
  name: 'clientReady',
  once: true,
  execute(client) {
    console.log(`✓ Bot logged in as ${client.user.tag}`);
    try {
      client.user.setActivity('discord bot', { type: 'WATCHING' });
    } catch (err) {
      console.error('[clientReady] Failed to set activity:', err);
    }
    try {
      giveawayScheduler.start(client);
    } catch (err) {
      console.error('[clientReady] Failed to start giveaway scheduler:', err);
    }
  },
};