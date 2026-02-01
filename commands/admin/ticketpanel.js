const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketpanel')
    .setDescription('Set up a ticket panel for members to create support tickets')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setColor('#FFB7C5')
      .setTitle('♡   .   —  ꒰ Aylina\'s Disc Support ꒱')
      .setDescription(`୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧\n\n　　　　　　𓂃 ִֶָ𐀔　Need Help?　𓂃 ִֶָ𐀔\n\nClick the button below to create a support ticket!\nAylina's staff will assist you as soon as possible. ♡`)
      .addFields(
        { 
          name: '⊹ ࣪✧ Before Opening a Ticket ˖ °', 
          value: '⟢ Check if your question is answered in FAQ\n⟢ Be patient while waiting for a response\n⟢ Provide as much detail as possible\n⟢ One ticket at a time please!', 
          inline: false 
        },
        { 
          name: '⊹ ࣪✧ What We Can Help With ˖ °', 
          value: '⟢ General questions\n⟢ Technical support\n⟢ Reports & issues\n⟢ Partnership inquiries', 
          inline: false 
        }
      )
      .setFooter({ text: '୭ ˚. ᵎᵎ 🍥 °  Aylina\'s Disc — Click the button below to get started!' })
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('create_ticket')
          .setLabel('Create Ticket')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('🎀')
      );

    // Send as a regular message (not a reply) so it stays as a permanent panel
    try {
      await interaction.channel.send({ embeds: [embed], components: [row] });
      await interaction.reply({ content: '⊹ ࣪✧ Ticket panel has been set up! ˖ °', ephemeral: true });
    } catch (error) {
      console.error('TicketPanel Error:', error);
      const errMsg = typeof error === 'string' ? error : (error.message || 'Unknown error');
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: `❌ Error: ${errMsg}`, ephemeral: true });
      } else {
        await interaction.reply({ content: `❌ Error: ${errMsg}`, ephemeral: true });
      }
    }
  },
};
