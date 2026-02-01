const AutoResponder = require('../models/AutoResponder');

// Cache for auto responders (in-memory for fast access)
const cache = new Map();

/**
 * Load all triggers for a guild into cache
 */
async function loadGuildTriggers(guildId) {
  const triggers = await AutoResponder.find({ guildId });
  const guildCache = new Map();
  triggers.forEach(t => {
    guildCache.set(t.trigger.toLowerCase(), {
      trigger: t.trigger,
      response: t.response,
      exactMatch: t.exactMatch,
      embedResponse: t.embedResponse,
      createdBy: t.createdBy,
      createdAt: t.createdAt
    });
  });
  cache.set(guildId, guildCache);
  return guildCache;
}

/**
 * Get all triggers for a guild
 */
async function getTriggers(guildId) {
  if (!cache.has(guildId)) {
    await loadGuildTriggers(guildId);
  }
  const guildCache = cache.get(guildId) || new Map();
  return Object.fromEntries(guildCache);
}

/**
 * Get trigger count for a guild
 */
async function getTriggerCount(guildId) {
  const triggers = await getTriggers(guildId);
  return Object.keys(triggers).length;
}

/**
 * Set/Add a new trigger
 */
async function setTrigger(guildId, trigger, response, options = {}) {
  try {
    const triggerLower = trigger.toLowerCase();
    
    await AutoResponder.findOneAndUpdate(
      { guildId, trigger: triggerLower },
      {
        guildId,
        trigger: triggerLower,
        response,
        exactMatch: options.exactMatch || false,
        embedResponse: options.embedResponse || false,
        createdBy: options.createdBy || 'Unknown',
        createdAt: options.createdAt || new Date()
      },
      { upsert: true, new: true }
    );

    // Update cache
    if (!cache.has(guildId)) {
      cache.set(guildId, new Map());
    }
    cache.get(guildId).set(triggerLower, {
      trigger: triggerLower,
      response,
      exactMatch: options.exactMatch || false,
      embedResponse: options.embedResponse || false,
      createdBy: options.createdBy || 'Unknown',
      createdAt: options.createdAt || new Date()
    });

    return true;
  } catch (error) {
    console.error('Error setting trigger:', error);
    return false;
  }
}

/**
 * Remove a trigger
 */
async function removeTrigger(guildId, trigger) {
  try {
    const triggerLower = trigger.toLowerCase();
    const result = await AutoResponder.deleteOne({ guildId, trigger: triggerLower });
    
    // Update cache
    if (cache.has(guildId)) {
      cache.get(guildId).delete(triggerLower);
    }

    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error removing trigger:', error);
    return false;
  }
}

/**
 * Check message for triggers
 */
async function checkTriggers(guildId, messageContent) {
  const triggers = await getTriggers(guildId);
  const content = messageContent.toLowerCase();

  for (const [key, data] of Object.entries(triggers)) {
    if (data.exactMatch) {
      if (content === key) {
        return data;
      }
    } else {
      if (content.includes(key)) {
        return data;
      }
    }
  }
  return null;
}

/**
 * Clear cache for a guild (useful when reloading)
 */
function clearCache(guildId) {
  if (guildId) {
    cache.delete(guildId);
  } else {
    cache.clear();
  }
}

module.exports = {
  getTriggers,
  getTriggerCount,
  setTrigger,
  removeTrigger,
  checkTriggers,
  loadGuildTriggers,
  clearCache
};
