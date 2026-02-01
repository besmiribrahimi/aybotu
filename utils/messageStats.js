const fs = require('fs');
const path = require('path');

const statsPath = path.join(__dirname, '..', 'stats.json');

const loadStats = () => {
  try {
    if (fs.existsSync(statsPath)) {
      return JSON.parse(fs.readFileSync(statsPath, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
  return {};
};

const saveStats = (stats) => {
  try {
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
};

const addMessage = (userId, guildId) => {
  const stats = loadStats();
  
  if (!stats[guildId]) stats[guildId] = {};
  if (!stats[guildId][userId]) {
    stats[guildId][userId] = { messages: 0 };
  }

  stats[guildId][userId].messages += 1;
  saveStats(stats);
};

const getLeaderboard = (guildId, limit = 10) => {
  const stats = loadStats();
  const guildStats = stats[guildId] || {};

  return Object.entries(guildStats)
    .map(([userId, data]) => ({
      userId,
      messages: data.messages,
    }))
    .sort((a, b) => b.messages - a.messages)
    .slice(0, limit);
};

const getUserStats = (userId, guildId) => {
  const stats = loadStats();
  return stats[guildId]?.[userId];
};

const getUserRank = (userId, guildId) => {
  const leaderboard = getLeaderboard(guildId, 1000);
  return leaderboard.findIndex(entry => entry.userId === userId) + 1;
};

module.exports = {
  loadStats,
  saveStats,
  addMessage,
  getLeaderboard,
  getUserStats,
  getUserRank,
};
