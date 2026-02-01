const { EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const { getLeaveChannel } = require('../utils/welcomeConfig');

module.exports = {
  name: 'guildMemberRemove',
  once: false,
  async execute(member) {
    const channel = await findChannel(member.guild, getLeaveChannel(member.guild.id));
    if (!channel) return;

    // Calculate how long they were in the server
    const joinedAt = member.joinedTimestamp;
    let timeInServer = 'Unknown';
    if (joinedAt) {
      const duration = Date.now() - joinedAt;
      const days = Math.floor(duration / (1000 * 60 * 60 * 24));
      const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      if (days > 0) {
        timeInServer = `${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}`;
      } else {
        timeInServer = `${hours} hour${hours !== 1 ? 's' : ''}`;
      }
    }

    const embed = new EmbedBuilder()
      .setColor('#FFB7C5')
      .setTitle(`♡   .   —  ꒰ Goodbye ꒱`)
      .setDescription(`୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧

　　　　　　𓂃 ִֶָ𐀔　Member Left　𓂃 ִֶָ𐀔

**${member.user.tag}** has left the server.`)
      .addFields(
        { name: '⊹ ࣪✧ Username ˖ °', value: `\`${member.user.tag}\``, inline: true },
        { name: '⊹ ࣪✧ Time in Server ˖ °', value: timeInServer, inline: true },
        { name: '⊹ ࣪✧ Account Age ˖ °', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
      )
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
      .setFooter({ text: '୭ ˚. ᵎᵎ 🍥 °  Aylina\'s Disc — We hope to see them again!' })
      .setTimestamp();

    await channel.send({ embeds: [embed] }).catch(() => {});
  },
};

async function findChannel(guild, configuredId) {
  if (configuredId) {
    const configured = guild.channels.cache.get(configuredId) || await guild.channels.fetch(configuredId).catch(() => null);
    if (configured && configured.permissionsFor(guild.members.me)?.has(PermissionsBitField.Flags.SendMessages)) {
      return configured;
    }
  }

  const systemChannel = guild.systemChannel;
  if (systemChannel && systemChannel.permissionsFor(guild.members.me)?.has(PermissionsBitField.Flags.SendMessages)) {
    return systemChannel;
  }

  return guild.channels.cache.find(ch =>
    ch.type === ChannelType.GuildText &&
    ch.permissionsFor(guild.members.me)?.has(PermissionsBitField.Flags.SendMessages)
  ) || null;
}
