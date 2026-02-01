const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resources')
    .setDescription('View free Discord resources and design tools'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#FFB7C5')
      .setTitle('♡   .   —  ꒰ Free Resources ꒱')
      .setDescription(`୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧\n\n　　　　　　𓂃 ִֶָ𐀔　Community Resources　𓂃 ִֶָ𐀔`)
      .addFields(
        { name: '⊹ ࣪✧ Layout Ideas ˖ °', value: 'Browse creative server layouts and channel organization tips.', inline: true },
        { name: '⊹ ࣪✧ Design Elements ˖ °', value: 'Free banners, dividers, emojis, and aesthetic assets.', inline: true },
        { name: '⊹ ࣪✧ Helpful Tools ˖ °', value: 'Bots, generators, and utilities to enhance your server.', inline: true },
        { name: '⊹ ࣪✧ Tips & Guides ˖ °', value: 'Tutorials on server setup, moderation, and community building.', inline: true },
        { name: '⊹ ࣪✧ Templates ˖ °', value: 'Ready-to-use templates for various server types.', inline: true },
        { name: '⊹ ࣪✧ Inspiration ˖ °', value: 'Get inspired by showcased servers and designs.', inline: true }
      )
      .addFields({
        name: '୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧',
        value: '　　　　　　𓂃 ִֶָ𐀔　sites I love using　𓂃 ִֶָ𐀔\n\n⟢ [Symbols](https://coolsymbol.com/) ⟢ Find aesthetic symbols for bio, channel, server ad layouts, and much more!\n\n⟢ [Emoji.gg](https://emoji.gg/) ⟢ [Discord Emoji](https://discordemoji.com/) ⟢ Browse and download emojis to add to your server.',
        inline: false
      })
      .setFooter({ text: '୭ ˚. ᵎᵎ 🍥 °  Aylina\'s Disc — Sharing is caring! Feel free to contribute.' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
