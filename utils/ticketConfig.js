const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'ticketConfig.json');

const defaultConfig = {
  ticketCount: 0,
  openTickets: {}
};

function loadConfig() {
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch {
    return defaultConfig;
  }
}

function saveConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function getNextTicketNumber() {
  const config = loadConfig();
  config.ticketCount += 1;
  saveConfig(config);
  return config.ticketCount;
}

function addOpenTicket(channelId, userId, ticketNumber) {
  const config = loadConfig();
  config.openTickets[channelId] = { userId, ticketNumber, createdAt: Date.now() };
  saveConfig(config);
}

function removeOpenTicket(channelId) {
  const config = loadConfig();
  delete config.openTickets[channelId];
  saveConfig(config);
}

function getOpenTicket(channelId) {
  const config = loadConfig();
  return config.openTickets[channelId] || null;
}

function hasOpenTicket(userId) {
  const config = loadConfig();
  return Object.values(config.openTickets).some(ticket => ticket.userId === userId);
}

module.exports = {
  loadConfig,
  saveConfig,
  getNextTicketNumber,
  addOpenTicket,
  removeOpenTicket,
  getOpenTicket,
  hasOpenTicket
};
