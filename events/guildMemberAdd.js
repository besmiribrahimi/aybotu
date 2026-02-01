const { EmbedBuilder, PermissionsBitField, ChannelType, AttachmentBuilder } = require('discord.js');
const { getWelcomeChannel } = require('../utils/welcomeConfig');

module.exports = {
  name: 'guildMemberAdd',
  once: false,
  async execute(member, client) {
    const channel = await findChannel(member.guild, getWelcomeChannel(member.guild.id));
    if (!channel) return;

    // Calculate account age
    const accountAge = Date.now() - member.user.createdTimestamp;
    const daysOld = Math.floor(accountAge / (1000 * 60 * 60 * 24));
    let accountStatus = '⊹ Established';
    if (daysOld < 7) accountStatus = '⊹ New Account (< 7 days)';
    else if (daysOld < 30) accountStatus = '⊹ Recent Account';

    // Main welcome message in channel
    const embed = new EmbedBuilder()
      .setColor('#FFB7C5')
      .setTitle(`♡   .   —  ꒰ Welcome to ${member.guild.name}! ꒱`)
      .setDescription(`୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧

　　　　　　𓂃 ִֶָ𐀔　New Member　𓂃 ִֶָ𐀔

Hey ${member}! ♡

Welcome to **${member.guild.name}**! We're so happy to have you here. Make yourself at home and don't be shy to say hi!

> *˚. ᵎᵎ Every great community starts with amazing people like you!*`)
      .addFields(
        { name: '⊹ ࣪✧ Username ˖ °', value: `\`${member.user.tag}\``, inline: true },
        { name: '⊹ ࣪✧ Member # ˖ °', value: `\`${member.guild.memberCount}\``, inline: true },
        { name: '⊹ ࣪✧ Account Status ˖ °', value: accountStatus, inline: true },
        { name: '⊹ ࣪✧ Account Created ˖ °', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:D>\n(<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>)`, inline: true },
        { name: '⊹ ࣪✧ Joined Server ˖ °', value: `<t:${Math.floor(Date.now() / 1000)}:f>`, inline: true },
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setFooter({ 
        text: `୭ ˚. ᵎᵎ 🍥 °  Aylina's Disc — I'm glad you're here! • Member #${member.guild.memberCount}`, 
        iconURL: client.user.displayAvatarURL() 
      })
      .setTimestamp();

    await channel.send({ 
      content: `♡ Welcome to the server, ${member}!`,
      embeds: [embed] 
    }).catch(() => {});

    // DM welcome message
    try {
      const dmEmbed = new EmbedBuilder()
        .setColor('#FFB7C5')
        .setTitle(`♡   .   —  ꒰ Welcome to ${member.guild.name}! ꒱`)
        .setDescription(`୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧

　　　　　　𓂃 ִֶָ𐀔　Hey there! 　𓂃 ִֶָ𐀔

Hi **${member.user.username}**! ♡

Thank you so much for joining **${member.guild.name}**! We're thrilled to have you as part of our community.`)
        .addFields(
          { 
            name: '⊹ ࣪✧ Quick Start Guide ˖ °', 
            value: 
              '⟢ Use `/help` to see all commands\n' +
              '⟢ Check out the channels and explore\n' +
              '⟢ Introduce yourself to the community\n' +
              '⟢ Have fun and make friends!',
            inline: false
          },
          { 
            name: '⊹ ࣪✧ Need Help? ˖ °', 
            value: 'If you need assistance, open a support ticket or reach out to a staff member!',
            inline: false
          },
          {
            name: '⊹ ࣪✧ Useful Commands ˖ °',
            value: '`/help` ⟢ View all commands\n`/welcome` ⟢ Server info\n`/resources` ⟢ Free resources',
            inline: true
          },
          {
            name: '⊹ ࣪✧ Server Stats ˖ °',
            value: `Members: \`${member.guild.memberCount}\`\nYou are member #${member.guild.memberCount}!`,
            inline: true
          }
        )
        .setThumbnail(member.guild.iconURL({ dynamic: true, size: 256 }))
        .setFooter({ 
          text: '୭ ˚. ᵎᵎ 🍥 °  Aylina\'s Disc — Thanks for joining us!', 
          iconURL: client.user.displayAvatarURL() 
        })
        .setTimestamp();

      await member.send({ embeds: [dmEmbed] }).catch(() => {});
    } catch (error) {
      console.log(`Could not send DM to ${member.user.tag}`);
    }
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
