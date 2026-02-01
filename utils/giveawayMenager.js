const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const filePath = path.join(__dirname, '../giveaways.json');

// In-memory store: key -> giveaway object. Each giveaway keeps a `participants` array
// for compatibility and an internal `_participantSet` for O(1) membership checks.
const giveaways = {};

let saveTimeout = null;
const SAVE_DELAY = 1000; // ms debounce

async function persistToDisk() {
  const tmpPath = `${filePath}.tmp`;
  try {
    // Convert in-memory giveaways to plain serializable object
    const serializable = {};
    for (const id in giveaways) {
      const g = giveaways[id];
      serializable[id] = {
        messageId: g.messageId,
        channelId: g.channelId,
        prize: g.prize,
        duration: g.duration,
        endTime: g.endTime,
        winners: g.winners,
        mode: g.mode,
        requiredRole: g.requiredRole || null,
        participants: g.participants || [],
        host: g.host || null
      };
    }
    await fsp.writeFile(tmpPath, JSON.stringify(serializable, null, 2), 'utf8');
    await fsp.rename(tmpPath, filePath);
  } catch (err) {
    console.error('[GiveawayManager] Failed to persist giveaways:', err);
    try { await fsp.unlink(tmpPath).catch(() => {}); } catch {};
  }
}

function scheduleSave(delay = SAVE_DELAY) {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    persistToDisk().catch(err => console.error('[GiveawayManager] persist error:', err));
    saveTimeout = null;
  }, delay);
}

function loadFromDiskSync() {
  try {
    if (!fs.existsSync(filePath)) return;
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw || '{}');
    for (const id in parsed) {
      const g = parsed[id];
      giveaways[id] = {
        ...g,
        participants: Array.isArray(g.participants) ? g.participants.slice() : [],
        _participantSet: new Set(Array.isArray(g.participants) ? g.participants : [])
      };
    }
  } catch (err) {
    console.error('[GiveawayManager] Failed to load giveaways from disk:', err);
  }
}

// Initialize on require
loadFromDiskSync();

function loadGiveaways() {
  // Return a shallow copy to avoid external mutation of internals
  const copy = {};
  for (const id in giveaways) {
    const g = giveaways[id];
    copy[id] = {
      ...g,
      participants: g.participants.slice()
    };
  }
  return copy;
}

function saveGiveaways(data) {
  // Backwards-compatible: accept external data and persist immediately
  try {
    for (const id in data) {
      const g = data[id];
      giveaways[id] = {
        ...g,
        participants: Array.isArray(g.participants) ? g.participants.slice() : [],
        _participantSet: new Set(Array.isArray(g.participants) ? g.participants : [])
      };
    }
    scheduleSave(0);
  } catch (err) {
    console.error('[GiveawayManager] saveGiveaways failed:', err);
  }
}

function addGiveaway(giveaway) {
  giveaways[giveaway.messageId] = {
    ...giveaway,
    participants: Array.isArray(giveaway.participants) ? giveaway.participants.slice() : [],
    _participantSet: new Set(Array.isArray(giveaway.participants) ? giveaway.participants : [])
  };
  scheduleSave(0);
}

function addParticipant(messageId, userId) {
  const g = giveaways[messageId];
  if (!g) return false;
  if (!g._participantSet) g._participantSet = new Set(g.participants || []);
  if (g._participantSet.has(userId)) return false;
  g._participantSet.add(userId);
  g.participants.push(userId);
  scheduleSave();
  return true;
}

function getGiveaway(messageId) {
  const g = giveaways[messageId];
  if (!g) return undefined;
  return {
    ...g,
    participants: g.participants.slice()
  };
}

function removeGiveaway(messageId) {
  delete giveaways[messageId];
  scheduleSave(0);
}

module.exports = {
  loadGiveaways,
  saveGiveaways,
  addGiveaway,
  addParticipant,
  getGiveaway,
  removeGiveaway,
};