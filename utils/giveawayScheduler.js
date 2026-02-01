const { EmbedBuilder } = require('discord.js');
const giveawayManager = require('./giveawayMenager.js');

function scheduleGiveawayEnd(client, giveaway) {
  const timeLeft = giveaway.endTime - Date.now();
  if (timeLeft <= 0) {
    endGiveaway(client, giveaway);
  } else {
    setTimeout(() => endGiveaway(client, giveaway), timeLeft);
  }
}

async function endGiveaway(client, giveaway) {
  let channel;
  try {
    channel = await client.channels.fetch(giveaway.channelId);
  } catch (err) {
    console.error('[giveawayScheduler] Failed to fetch channel', giveaway.channelId, err);
    return giveawayManager.removeGiveaway(giveaway.messageId);
  }

  let message = null;
  try {
    message = await channel.messages.fetch(giveaway.messageId);
  } catch (err) {
    console.warn('[giveawayScheduler] Giveaway message not found, will attempt fallback announcement in channel', giveaway.messageId);
    message = null;
  }

  const participants = giveaway.participants || [];
  let winners = [];

  if (participants.length === 0) {
    try {
      await channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FFD1DC')
            .setTitle('♡   .   —  ꒰ No Winners ꒱')
            .setDescription(`୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧\n\nNo one entered the giveaway for **${giveaway.prize}**. Maybe next time! 😢`)
            .setFooter({ text: '୭ ˚. ᵎᵎ 🍥 °  Giveaway ended with no entries.' })
        ]
      });
    } catch (err) {
      console.error('[giveawayScheduler] Failed to announce no-winner message in channel', giveaway.channelId, err);
    }
  } else {
    // Pick winners
    const winnerCount = Math.min(giveaway.winners, participants.length);
    const shuffled = participants.sort(() => 0.5 - Math.random());
    winners = shuffled.slice(0, winnerCount);

    try {
      await channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#E8A2D0')
            .setTitle('♡   .   —  ꒰ Giveaway Winners ꒱')
            .setDescription(
              `୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧\n\n` +
              `🎀 Congratulations ${winners.map(id => `<@${id}>`).join(', ')}!\n` +
              `You won **${giveaway.prize}**! ♡\n\n` +
              `Thank you to everyone who participated!`
            )
            .setFooter({ text: '୭ ˚. ᵎᵎ 🍥 °  Giveaway ended! Stay tuned for more~' })
        ],
        allowedMentions: { users: winners }
      });
    } catch (err) {
      console.error('[giveawayScheduler] Failed to announce winners in channel', giveaway.channelId, err);
    }
  }

  // Edit the original giveaway message to show it's ended (if available)
  if (message && message.embeds && message.embeds[0]) {
    try {
      const endedEmbed = EmbedBuilder.from(message.embeds[0])
        .setTitle('♡   .   —  ꒰ Giveaway Ended ꒱')
        .setColor('#cccccc')
        .setFooter({ text: '୭ ˚. ᵎᵎ 🍥 °  This giveaway has ended.' });
      await message.edit({ embeds: [endedEmbed], components: [] });
    } catch (err) {
      console.error('[giveawayScheduler] Failed to edit original giveaway message', giveaway.messageId, err);
    }
  }

  // Remove the giveaway from storage
  try {
    giveawayManager.removeGiveaway(giveaway.messageId);
  } catch (err) {
    console.error('[giveawayScheduler] Failed to remove giveaway from storage', giveaway.messageId, err);
  }
}

function start(client) {
  const giveaways = giveawayManager.loadGiveaways();
  for (const id in giveaways) {
    scheduleGiveawayEnd(client, giveaways[id]);
  }

  // Periodic safety check: ensure expired giveaways are ended even
  // if a scheduled timeout was missed (process hiccup, long delays,
  // or setTimeout limits). Runs every 30 seconds.
  const CHECK_INTERVAL = 30 * 1000;
  setInterval(() => {
    try {
      const current = giveawayManager.loadGiveaways();
      const now = Date.now();
      for (const id in current) {
        const g = current[id];
        if (g.endTime <= now) {
          // endGiveaway will remove the giveaway from storage
          endGiveaway(client, g);
        }
      }
    } catch (err) {
      console.error('[giveawayScheduler] Periodic check failed:', err);
    }
  }, CHECK_INTERVAL);
}

module.exports = { start, scheduleGiveawayEnd };