const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get help or view all available commands'),
  async execute(interaction) {
    // Check if user has admin permissions
    const isAdmin = interaction.member.permissions.has(PermissionFlagsBits.Administrator);

    const embed = new EmbedBuilder()
      .setColor('#FFB7C5')
      .setTitle('♡   .   —  ꒰ Quick Server Guide! ꒱')
      .setDescription(`୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧\n\n　　　　　　𓂃 ִֶָ𐀔　In this server　𓂃 ִֶָ𐀔`)
      .addFields(
        { name: '⊹ ࣪✧ FAQ Forum ˖ °', value: 'Browse tutorials and guides.', inline: false },
        { name: '⊹ ࣪✧ webhooks ˖ °', value: 'Aes. and easy to copy & paste webhooks.', inline: false },
        { name: '⊹ ࣪✧ shop ˖ °', value: 'Browse ready-made, premium server templates.', inline: false },
        { name: '⊹ ࣪✧ questions ˖ °', value: 'Ask questions and get answers.', inline: false },
        { name: '⊹ ࣪✧ ask 4 help ˖ °', value: 'Ask other members for assistance.', inline: false },
        { name: '⊹ ࣪✧ taking requests ˖ °', value: 'Browse services members are offering RIGHT NOW.', inline: false },
        { name: '⊹ ࣪✧ hire staff ˖ °', value: 'Search through staff applications and recruit someone.', inline: false },
        { name: '⊹ ࣪✧ support tickets ˖ °', value: 'Have any questions or concerns? Let us know by opening a ticket.', inline: false }
      )
      .addFields({
        name: '୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧',
        value: '　　　　　　𓂃 ִֶָ𐀔　Member Commands　𓂃 ִֶָ𐀔\n\n`/faq` ⟢ Server info & FAQ\n`/resources` ⟢ Free resources\n`/commissions` ⟢ Shop & commissions\n`/help` ⟢ You\'re here!\n`/support` ⟢ Support us\n`/about` ⟢ About the server\n`/request` ⟢ Request help',
        inline: false
      });

    // Only show admin commands to users with Administrator permission
    if (isAdmin) {
      embed.addFields({
        name: '୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧',
        value: '　　　　　　𓂃 ִֶָ𐀔　Admin Commands　𓂃 ִֶָ𐀔\n\n`/ban` ⟢ Ban a member\n`/kick` ⟢ Kick a member\n`/timeout` ⟢ Timeout a member\n`/warn` ⟢ Warn a member\n`/unban` ⟢ Unban a member\n`/announce` ⟢ Make an announcement\n`/embed` ⟢ Create a custom embed\n`/giveaway` ⟢ Start a giveaway\n`/ticketpanel` ⟢ Setup ticket system\n`/setwelcome` ⟢ Set welcome channel\n`/setleave` ⟢ Set leave channel\n`/logset` ⟢ Set mod log channel\n`/autorespond` ⟢ Auto responder settings\n`/helpset` ⟢ Configure help settings',
        inline: false
      });
    }

    embed
      .setFooter({ text: '୭ ˚. ᵎᵎ 🍥 °  Aylina\'s Disc — I\'m glad you\'re here!' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
