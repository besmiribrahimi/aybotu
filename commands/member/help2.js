const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help2')
    .setDescription('View detailed command descriptions'),
  async execute(interaction) {
    // Check if user has admin permissions
    const isAdmin = interaction.member.permissions.has(PermissionFlagsBits.Administrator);

    const embed = new EmbedBuilder()
      .setColor('#FFB7C5')
      .setTitle('♡   .   —  ꒰ Command Details! ꒱')
      .setDescription(`୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧\n\n　　　　　　𓂃 ִֶָ𐀔　Member Commands　𓂃 ִֶָ𐀔`)
      .addFields(
        { name: '`/faq`', value: '⟢ View frequently asked questions and server information', inline: false },
        { name: '`/resources`', value: '⟢ Access free resources and useful links', inline: false },
        { name: '`/commissions`', value: '⟢ Browse the shop and commission services', inline: false },
        { name: '`/leaderboard`', value: '⟢ View the message activity leaderboard', inline: false },
        { name: '`/rank`', value: '⟢ View your message rank and stats', inline: false },
        { name: '`/help`', value: '⟢ Quick overview of server features and commands', inline: false },
        { name: '`/help2`', value: '⟢ View detailed command descriptions (you\'re here!)', inline: false },
        { name: '`/support`', value: '⟢ Learn how to support the server', inline: false },
        { name: '`/about`', value: '⟢ Learn about the server and its purpose', inline: false },
        { name: '`/request`', value: '⟢ Submit a help request to other members', inline: false }
      );

    // Only show admin commands to users with Administrator permission
    if (isAdmin) {
      embed.addFields({
        name: '୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧',
        value: '　　　　　　𓂃 ִֶָ𐀔　Admin Commands　𓂃 ִֶָ𐀔',
        inline: false
      });
      embed.addFields(
        { name: '`/ban`', value: '⟢ Ban a member from the server with an optional reason', inline: false },
        { name: '`/kick`', value: '⟢ Kick a member from the server', inline: false },
        { name: '`/timeout`', value: '⟢ Temporarily mute a member for a set duration', inline: false },
        { name: '`/warn`', value: '⟢ Send a warning DM to a member', inline: false },
        { name: '`/unban`', value: '⟢ Unban a previously banned member by their ID', inline: false },
        { name: '`/announce`', value: '⟢ Make an announcement to a specified channel', inline: false },
        { name: '`/embed`', value: '⟢ Create a custom embed message', inline: false },
        { name: '`/giveaway`', value: '⟢ Start a giveaway with customizable options', inline: false },
        { name: '`/ticketpanel`', value: '⟢ Setup or configure the ticket support system', inline: false },
        { name: '`/setwelcome`', value: '⟢ Set the channel for welcome messages', inline: false },
        { name: '`/setleave`', value: '⟢ Set the channel for leave/goodbye messages', inline: false },
        { name: '`/logset`', value: '⟢ Set the channel for moderation logs', inline: false },
        { name: '`/autorespond`', value: '⟢ Configure automatic responses to keywords', inline: false },
        { name: '`/helpset`', value: '⟢ Configure help command settings', inline: false }
      );
    }

    embed
      .setFooter({ text: '୭ ˚. ᵎᵎ 🍥 °  Aylina\'s Disc — I\'m glad you\'re here!' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
