const { addMessage } = require('../utils/messageStats');
const { EmbedBuilder } = require('discord.js');
const { sendLog } = require('../utils/modLog');
const { bannedWords } = require('../utils/bannedWords');
const { checkTriggers } = require('../utils/autoResponder');

module.exports = {
  name: 'messageCreate',
  once: false,
  async execute(message) {
    if (message.author.bot) return;
    if (!message.guild) return;

    const lower = message.content.toLowerCase();
    if (bannedWords.some(word => lower.includes(word))) {
      await message.delete().catch(() => {});

      const embed = new EmbedBuilder()
        .setColor('#ff4d4f')
        .setTitle('Message Removed')
        .setDescription('A message was removed for containing a blocked word.')
        .addFields(
          { name: 'User', value: `${message.author.tag} (${message.author.id})`, inline: false },
          { name: 'Blocked words', value: bannedWords.map(w => `• ${w}`).join('\n'), inline: false },
          { name: 'Channel', value: `${message.channel}`, inline: true },
          { name: 'Server', value: `${message.guild.name}`, inline: true },
        )
        .setTimestamp();

      // Log to mod channel if configured (no DM to avoid double notifications)
      await sendLog({
        guild: message.guild,
        client: message.client,
        action: 'Blocked Word',
        targetUser: message.author,
        moderator: null,
        reason: 'Blocked word detected',
      }).catch(() => {});

      return;
    }

    // Check for autoresponder triggers
    const triggerData = checkTriggers(message.guild.id, message.content);
    if (triggerData) {
      try {
        if (triggerData.embedResponse) {
          // Send as cute embed
          const responseEmbed = new EmbedBuilder()
            .setColor('#FFD1DC')
            .setDescription(`୨୧ ♡ ୨୧\n\n${triggerData.response}`)
            .setFooter({ text: '୭ ˚. ᵎᵎ 🍥 °' });
          
          await message.reply({ embeds: [responseEmbed] });
        } else {
          // Send as plain text
          await message.reply(triggerData.response);
        }
      } catch (err) {
        console.error('Autoresponder error:', err);
      }
    }

    addMessage(message.author.id, message.guildId);
  },
};
