const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('faq')
    .setDescription('Display the server FAQ and info'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#FFB7C5')
      .setTitle('♡   .   —  ꒰ Welcome to Aylina\'s Disc! ꒱')
      .setDescription(`୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧\n\n　　　　　　𓂃 ִֶָ𐀔　What You'll Find Here　𓂃 ִֶָ𐀔\n\nYour go-to hub for Discord resources, help, and services ❕`)
      .addFields(
        { 
          name: '⊹ ࣪✧ Free Discord Resources ˖ °', 
          value: 'Layout ideas, tips, design elements, and helpful tools shared by the community.', 
          inline: false 
        },
        { 
          name: '⊹ ࣪✧ Commissions & Shop ˖ °', 
          value: 'A space for vetted creators to showcase their work (templates, Twitch assets, graphics, more).', 
          inline: false 
        },
        { 
          name: '⊹ ࣪✧ Looking for Help? ˖ °', 
          value: 'Post what you need and get help from people ready to assist you or recommend someone who can.', 
          inline: false 
        },
        { 
          name: '⊹ ࣪✧ Collaborative ˖ °', 
          value: 'We\'re all about sharing, supporting, and uplifting each other in the Design and freelance world.', 
          inline: false 
        }
      )
      .addFields({
        name: '୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧',
        value: '☕ [Support on Ko-fi](https://ko-fi.com/aylina_ina)',
        inline: false
      })
      .setFooter({ text: '୭ ˚. ᵎᵎ 🍥 °  Aylina\'s Disc — Whether you\'re here to learn, share, hire, or just explore — welcome in!' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
