const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../autoResponderConfig.json');

// Load config
function loadConfig() {
  try {
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading autoresponder config:', err);
  }
  return { triggers: {} };
}

// Save config
function saveConfig(config) {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return true;
  } catch (err) {
    console.error('Error saving autoresponder config:', err);
    return false;
  }
}

// Get all triggers for a guild
function getTriggers(guildId) {
  const config = loadConfig();
  return config.triggers[guildId] || {};
}

// Add or update a trigger
function setTrigger(guildId, trigger, response, options = {}) {
  const config = loadConfig();
  
  if (!config.triggers[guildId]) {
    config.triggers[guildId] = {};
  }
  
  const triggerLower = trigger.toLowerCase();
  config.triggers[guildId][triggerLower] = {
    trigger: trigger,
    response: response,
    exactMatch: options.exactMatch || false,
    embedResponse: options.embedResponse || false,
    createdBy: options.createdBy || 'Unknown',
    createdAt: options.createdAt || new Date().toISOString()
  };
  
  return saveConfig(config);
}

// Remove a trigger
function removeTrigger(guildId, trigger) {
  const config = loadConfig();
  
  if (!config.triggers[guildId]) return false;
  
  const triggerLower = trigger.toLowerCase();
  if (!config.triggers[guildId][triggerLower]) return false;
  
  delete config.triggers[guildId][triggerLower];
  return saveConfig(config);
}

// Check message for triggers and get response
function checkTriggers(guildId, messageContent) {
  const triggers = getTriggers(guildId);
  const contentLower = messageContent.toLowerCase();
  
  for (const [key, data] of Object.entries(triggers)) {
    if (data.exactMatch) {
      // Exact match - message must be exactly the trigger
      if (contentLower === key) {
        return data;
      }
    } else {
      // Contains match - trigger word appears anywhere in message
      if (contentLower.includes(key)) {
        return data;
      }
    }
  }
  
  return null;
}

// Get trigger count for a guild
function getTriggerCount(guildId) {
  const triggers = getTriggers(guildId);
  return Object.keys(triggers).length;
}

module.exports = {
  getTriggers,
  setTrigger,
  removeTrigger,
  checkTriggers,
  getTriggerCount
};
