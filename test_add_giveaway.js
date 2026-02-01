const gm = require('./utils/giveawayMenager.js');

console.log('Before add, giveaways keys:', Object.keys(gm.loadGiveaways()));

gm.addGiveaway({
  messageId: 'test_add_001',
  channelId: 'test_chan',
  prize: 'Debug Prize',
  duration: 60000,
  endTime: Date.now() + 60000,
  winners: 1,
  mode: 'normal',
  requiredRole: null,
  participants: [],
  host: 'tester'
});

console.log('Added giveaway; waiting 2s for async save...');
setTimeout(() => {
  console.log('After add, giveaways keys:', Object.keys(gm.loadGiveaways()));
  process.exit(0);
}, 2000);
