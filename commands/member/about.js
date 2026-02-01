const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Learn more about Aylina\'s Disc'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#FFB7C5')
      .setTitle('♡   .   —  ꒰ About Aylina\'s Disc ꒱')
      .setDescription(`୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧\n\n　　　　　　𓂃 ִֶָ𐀔　Our Mission　𓂃 ִֶָ𐀔\n\nA cozy corner of Discord dedicated to designers, creators, and community lovers!`)
      .addFields(
        { 
          name: '⊹ ࣪✧ What We Believe In ˖ °', 
          value: '⟢ Collaboration over competition\n⟢ Sharing knowledge freely\n⟢ Supporting independent creators\n⟢ Building a positive community', 
          inline: false 
        },
        { 
          name: '⊹ ࣪✧ Community Values ˖ °', 
          value: '⟢ Be kind and respectful\n⟢ Help others when you can\n⟢ Share your knowledge\n⟢ Celebrate each other\'s wins', 
          inline: false 
        },
        { 
          name: '⊹ ࣪✧ Server Stats ˖ °', 
          value: `⟢ Members: ${interaction.guild.memberCount}\n⟢ Created with ♡`, 
          inline: false 
        }
      )
      .setFooter({ text: '୭ ˚. ᵎᵎ 🍥 °  Aylina\'s Disc — I\'m glad you\'re here!' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
