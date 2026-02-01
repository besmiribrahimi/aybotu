const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

const storePath = path.join(__dirname, '..', 'modlog.json');
const configPath = path.join(__dirname, '..', 'logConfig.json');

const load = () => {
  try {
    if (fs.existsSync(storePath)) {
      return JSON.parse(fs.readFileSync(storePath, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading mod log store:', err);
  }
  return { guilds: {}, actions: [] };
};

const save = (data) => {
  try {
    fs.writeFileSync(storePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error saving mod log store:', err);
  }
};

const setLogChannel = (guildId, channelId) => {
  const data = load();
  if (!data.guilds) data.guilds = {};
  data.guilds[guildId] = { channelId };
  save(data);
};

const getLogChannel = (guildId) => {
  // First check the new logConfig.json
  try {
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (config[guildId]?.logChannelId) {
        return config[guildId].logChannelId;
      }
    }
  } catch (err) {}
  
  // Fallback to old modlog.json format
  const data = load();
  return data.guilds?.[guildId]?.channelId;
};

const sendModLog = async (guild, action, moderator, target, reason, extraFields = []) => {
  const logChannelId = getLogChannel(guild.id);
  if (!logChannelId) return;

  const logChannel = guild.channels.cache.get(logChannelId);
  if (!logChannel) return;

  const actionColors = {
    'Ban': '#FF6B6B',
    'Kick': '#FFA94D',
    'Warn': '#FFE066',
    'Unban': '#69DB7C',
    'Mute': '#748FFC',
    'Unmute': '#69DB7C',
    'Timeout': '#748FFC'
  };

  const actionEmojis = {
    'Ban': '⛔',
    'Kick': '👢',
    'Warn': '⚠️',
    'Unban': '✅',
    'Mute': '🔇',
    'Unmute': '🔊',
    'Timeout': '⏰'
  };

  const embed = new EmbedBuilder()
    .setColor(actionColors[action] || '#FFB7C5')
    .setTitle(`♡   .   —  ꒰ ${actionEmojis[action] || '📋'} ${action} ꒱`)
    .setDescription(`୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧\n\n　　　　　　𓂃 ִֶָ𐀔　Mod Action　𓂃 ִֶָ𐀔`)
    .addFields(
      { name: '⊹ ࣪✧ User ˖ °', value: `${target.tag || target}\n\`${target.id || 'N/A'}\``, inline: true },
      { name: '⊹ ࣪✧ Moderator ˖ °', value: `${moderator.tag}\n\`${moderator.id}\``, inline: true },
      { name: '⊹ ࣪✧ Reason ˖ °', value: reason || 'No reason provided', inline: false },
      ...extraFields
    )
    .setThumbnail(target.displayAvatarURL ? target.displayAvatarURL({ dynamic: true }) : null)
    .setFooter({ text: '୭ ˚. ᵎᵎ 🍥 °  Mod Log' })
    .setTimestamp();

  await logChannel.send({ embeds: [embed] }).catch(() => {});

  // Store action in history
  const data = load();
  if (!data.actions) data.actions = [];
  data.actions.push({
    guildId: guild.id,
    oderId: target.id,
    username: target.tag || target,
    action: action,
    moderator: moderator?.tag || 'System',
    reason: reason || 'No reason provided',
    timestamp: new Date().toISOString(),
  });
  save(data);
};

const sendLog = async ({ guild, client, action, targetUser, moderator, reason }) => {
  await sendModLog(guild, action, moderator, targetUser, reason);
};

const getUserActions = (guildId, userId) => {
  const data = load();
  if (!data.actions) return [];
  return data.actions.filter(a => a.guildId === guildId && a.userId === userId);
};

module.exports = {
  setLogChannel,
  getLogChannel,
  sendLog,
  sendModLog,
  getUserActions,
};
