const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '..', 'welcomeConfig.json');

const load = () => {
  try {
    if (fs.existsSync(storePath)) {
      return JSON.parse(fs.readFileSync(storePath, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading welcome config:', err);
  }
  return { guilds: {} };
};

const save = (data) => {
  try {
    fs.writeFileSync(storePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error saving welcome config:', err);
  }
};

const setWelcomeChannel = (guildId, channelId) => {
  const data = load();
  if (!data.guilds[guildId]) data.guilds[guildId] = {};
  data.guilds[guildId].welcomeChannelId = channelId;
  save(data);
};

const setLeaveChannel = (guildId, channelId) => {
  const data = load();
  if (!data.guilds[guildId]) data.guilds[guildId] = {};
  data.guilds[guildId].leaveChannelId = channelId;
  save(data);
};

const getWelcomeChannel = (guildId) => {
  const data = load();
  return data.guilds[guildId]?.welcomeChannelId;
};

const getLeaveChannel = (guildId) => {
  const data = load();
  return data.guilds[guildId]?.leaveChannelId;
};

module.exports = {
  setWelcomeChannel,
  setLeaveChannel,
  getWelcomeChannel,
  getLeaveChannel,
};
