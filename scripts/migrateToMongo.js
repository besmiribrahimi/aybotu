/**
 * Migration Script: JSON to MongoDB
 * Run this script ONCE to migrate your existing JSON data to MongoDB
 * 
 * Usage: node scripts/migrateToMongo.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import models
const GuildConfig = require('../database/models/GuildConfig');
const AutoResponder = require('../database/models/AutoResponder');
const ModLog = require('../database/models/ModLog');
const MessageStats = require('../database/models/MessageStats');
const Giveaway = require('../database/models/Giveaway');
const Ticket = require('../database/models/Ticket');

const readJSON = (filename) => {
  const filepath = path.join(__dirname, '..', filename);
  try {
    if (fs.existsSync(filepath)) {
      return JSON.parse(fs.readFileSync(filepath, 'utf8'));
    }
  } catch (error) {
    console.error(`Error reading ${filename}:`, error.message);
  }
  return null;
};

async function migrate() {
  console.log('˖ ݁𖥔 Starting migration to MongoDB...\n');

  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ Connected to MongoDB\n');

  // 1. Migrate Guild Configs (welcome, leave, log, help channels)
  console.log('📦 Migrating Guild Configurations...');
  
  const welcomeConfig = readJSON('welcomeConfig.json');
  const logConfig = readJSON('logConfig.json');
  const helpConfig = readJSON('helpConfig.json');
  const modlogData = readJSON('modlog.json');
  const ticketConfig = readJSON('ticketConfig.json');

  const guildIds = new Set();
  
  // Collect all guild IDs
  if (welcomeConfig?.guilds) Object.keys(welcomeConfig.guilds).forEach(id => guildIds.add(id));
  if (logConfig) Object.keys(logConfig).forEach(id => guildIds.add(id));
  if (helpConfig) Object.keys(helpConfig).forEach(id => guildIds.add(id));
  if (modlogData?.guilds) Object.keys(modlogData.guilds).forEach(id => guildIds.add(id));

  for (const guildId of guildIds) {
    const config = {
      guildId,
      welcomeChannelId: welcomeConfig?.guilds?.[guildId]?.welcomeChannelId || null,
      leaveChannelId: welcomeConfig?.guilds?.[guildId]?.leaveChannelId || null,
      logChannelId: logConfig?.[guildId]?.logChannelId || null,
      helpChannelId: helpConfig?.[guildId]?.helpChannelId || null,
      modlogChannelId: modlogData?.guilds?.[guildId]?.channelId || null,
      ticketCount: ticketConfig?.ticketCount || 0
    };

    await GuildConfig.findOneAndUpdate(
      { guildId },
      config,
      { upsert: true }
    );
    console.log(`  ✓ Guild ${guildId} config migrated`);
  }

  // 2. Migrate Auto Responders
  console.log('\n📦 Migrating Auto Responders...');
  const autoResponderConfig = readJSON('autoResponderConfig.json');
  
  if (autoResponderConfig?.triggers) {
    for (const [guildId, triggers] of Object.entries(autoResponderConfig.triggers)) {
      for (const [trigger, data] of Object.entries(triggers)) {
        await AutoResponder.findOneAndUpdate(
          { guildId, trigger: trigger.toLowerCase() },
          {
            guildId,
            trigger: trigger.toLowerCase(),
            response: data.response,
            exactMatch: data.exactMatch || false,
            embedResponse: data.embedResponse || false,
            createdBy: data.createdBy || 'Unknown',
            createdAt: data.createdAt ? new Date(data.createdAt) : new Date()
          },
          { upsert: true }
        );
        console.log(`  ✓ Trigger "${trigger}" for guild ${guildId} migrated`);
      }
    }
  }

  // 3. Migrate Mod Logs
  console.log('\n📦 Migrating Mod Logs...');
  if (modlogData?.actions) {
    for (const action of modlogData.actions) {
      // Check if this exact action already exists
      const existing = await ModLog.findOne({
        guildId: action.guildId,
        oderId: action.userId,
        action: action.action,
        timestamp: new Date(action.timestamp)
      });

      if (!existing) {
        await ModLog.create({
          guildId: action.guildId,
          oderId: action.userId,
          username: action.username,
          action: action.action.replace(/\s*\([^)]*\)/, ''), // Remove duration from action name
          moderator: action.moderator,
          moderatorId: action.moderatorId || 'unknown',
          reason: action.reason || 'No reason provided',
          duration: action.action.match(/\(([^)]+)\)/)?.[1] || null,
          timestamp: new Date(action.timestamp)
        });
        console.log(`  ✓ Mod action for user ${action.username} migrated`);
      }
    }
  }

  // 4. Migrate Message Stats
  console.log('\n📦 Migrating Message Stats...');
  const stats = readJSON('stats.json');
  
  if (stats) {
    for (const [guildId, users] of Object.entries(stats)) {
      for (const [oderId, data] of Object.entries(users)) {
        await MessageStats.findOneAndUpdate(
          { guildId, oderId },
          {
            guildId,
            oderId,
            messages: data.messages || 0
          },
          { upsert: true }
        );
        console.log(`  ✓ Stats for user ${oderId} in guild ${guildId} migrated`);
      }
    }
  }

  // 5. Migrate Giveaways
  console.log('\n📦 Migrating Giveaways...');
  const giveaways = readJSON('giveaways.json');
  
  if (giveaways && Object.keys(giveaways).length > 0) {
    for (const [messageId, data] of Object.entries(giveaways)) {
      await Giveaway.findOneAndUpdate(
        { messageId },
        {
          guildId: data.guildId,
          channelId: data.channelId,
          messageId,
          prize: data.prize,
          winners: data.winners || 1,
          endsAt: new Date(data.endsAt),
          hostId: data.hostId,
          hostTag: data.hostTag,
          participants: data.participants || [],
          ended: data.ended || false,
          winnerIds: data.winnerIds || []
        },
        { upsert: true }
      );
      console.log(`  ✓ Giveaway ${messageId} migrated`);
    }
  } else {
    console.log('  No giveaways to migrate');
  }

  console.log('\n✨ Migration completed successfully!');
  console.log('\n⚠️  Remember to:');
  console.log('   1. Update your .env file with MONGODB_URI');
  console.log('   2. The JSON files are kept as backup');
  console.log('   3. Test the bot thoroughly before deleting JSON files\n');

  await mongoose.connection.close();
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
