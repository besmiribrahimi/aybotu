const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('support')
    .setDescription('Support the server and help us grow'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#FFB7C5')
      .setTitle('♡   .   —  ꒰ Support Aylina\'s Disc ꒱')
      .setDescription(`୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧\n\n　　　　　　𓂃 ִֶָ𐀔　Why Support Us?　𓂃 ִֶָ𐀔\n\nYour support helps us keep this community running and growing!`)
      .addFields(
        { 
          name: '⊹ ࣪✧ Benefits ˖ °', 
          value: '⟢ Keep the server ad-free\n⟢ Fund new resources and features\n⟢ Support community events\n⟢ Help us grow and improve', 
          inline: false 
        },
        { 
          name: '⊹ ࣪✧ Supporter Perks ˖ °', 
          value: '⟢ Exclusive supporter role\n⟢ Access to special channels\n⟢ Priority in giveaways\n⟢ Our eternal gratitude! ♡', 
          inline: false 
        }
      )
      .setFooter({ text: '୭ ˚. ᵎᵎ 🍥 °  Aylina\'s Disc — Every little bit helps! Thank you ♡' })
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('☕ Support on Ko-fi')
          .setURL('https://ko-fi.com/aylina_ina')
          .setStyle(ButtonStyle.Link)
      );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
