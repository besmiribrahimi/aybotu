const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', '..', 'config.json');

const loadConfig = () => {
  try {
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading config:', error);
  }
  return {};
};

const saveConfig = (config) => {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Error saving config:', error);
  }
};

const setAdminChannel = (guildId, channelId) => {
  const config = loadConfig();
  if (!config.guilds) config.guilds = {};
  config.guilds[guildId] = { adminChannelId: channelId };
  saveConfig(config);
};

const getAdminChannel = (guildId) => {
  const config = loadConfig();
  return config.guilds?.[guildId]?.adminChannelId;
};

const removeAdminChannel = (guildId) => {
  const config = loadConfig();
  if (config.guilds?.[guildId]) {
    delete config.guilds[guildId];
    saveConfig(config);
  }
};

module.exports = {
  loadConfig,
  saveConfig,
  setAdminChannel,
  getAdminChannel,
  removeAdminChannel,
};
