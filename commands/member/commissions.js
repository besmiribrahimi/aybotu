const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('commissions')
    .setDescription('Learn about Aylina and her commissions'),
  async execute(interaction) {
    const aboutEmbed = new EmbedBuilder()
      .setColor('#FFD1DC')
      .setTitle('♡   .   —  ꒰ 🌸 About Aylina 🌸 ꒱')
      .setDescription(`୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧\n\nHi, I'm **Aylina**! ♡ A digital artist with **7+ years** experience making graphics and **5+ years** experience with Discord — from bots, growing servers, and design aspects!`)
      .addFields(
        { 
          name: '🍒 ⊹ ࣪✧ Expertise ˖ °', 
          value: '⟢ Discord Templates\n⟢ Building Servers\n⟢ Creating Emojis\n⟢ Cute Pastel Designs', 
          inline: true 
        },
        { 
          name: '🧚 ⊹ ࣪✧ Skills ˖ °', 
          value: '⟢ Canva\n⟢ Procreate\n⟢ 30+ Discord Bots', 
          inline: true 
        },
        { 
          name: '🌸 ⊹ ࣪✧ Accomplishments ˖ °', 
          value: '✿ **1,250+** sales on digital creations\n✿ **100+** designs created\n✿ **800k** monthly views on Pinterest\n✿ **4.9 ⭐** rating on Etsy (Dec 2025)', 
          inline: false 
        },
        {
          name: '🍒 ⊹ ࣪✧ Check Out My Work ˖ °',
          value: 'Use the dropdown below to get links to my socials and portfolio! ♡',
          inline: false
        }
      )
      .setFooter({ text: '୭ ˚. ᵎᵎ 🍥 °  Thank you for supporting my art journey!' })
      .setTimestamp();

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('aylina_socials')
      .setPlaceholder('🌸 Select a platform to view ♡')
      .addOptions([
        {
          label: 'Ko-fi',
          description: '600+ followers — freebies, resources & templates',
          value: 'kofi',
          emoji: '☕'
        },
        {
          label: 'Etsy',
          description: 'Digital assets, Discord templates & Twitch panels',
          value: 'etsy',
          emoji: '🛒'
        },
        {
          label: 'TikTok',
          description: 'Updates, tutorials & showcases',
          value: 'tiktok',
          emoji: '🎵'
        },
        {
          label: 'Instagram',
          description: 'Reposts from TikTok & more',
          value: 'instagram',
          emoji: '📸'
        },
        {
          label: 'YouTube',
          description: 'Long format tutorials & speed creates',
          value: 'youtube',
          emoji: '🎬'
        },
        {
          label: 'Pinterest',
          description: '700k monthly views — Discord server templates!',
          value: 'pinterest',
          emoji: '📌'
        },
        {
          label: 'Bluesky',
          description: 'Secondary portfolio',
          value: 'bluesky',
          emoji: '🦋'
        },
        {
          label: 'Twitter/X',
          description: 'Main portfolio',
          value: 'twitter',
          emoji: '🐦'
        },
        {
          label: 'Threads',
          description: 'Follow my ecommerce journey as a business major',
          value: 'threads',
          emoji: '🧵'
        },
        {
          label: 'Linktree',
          description: 'All my most in-demand links (always updated!)',
          value: 'linktree',
          emoji: '🔗'
        }
      ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const buttonRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('send_all_links')
          .setLabel('🌸 Send All Links ♡')
          .setStyle(ButtonStyle.Secondary)
      );

    await interaction.reply({ embeds: [aboutEmbed], components: [row, buttonRow] });
  },

  // Social links configuration - update these when rebranding is complete!
  socialLinks: {
    kofi: { name: 'Ko-fi', url: 'https://ko-fi.com/aylina_ina', emoji: '☕', description: '600+ followers selling freebies, resources, and server templates' },
    etsy: { name: 'Etsy', url: 'https://quinipie.etsy.com/', emoji: '🛒', description: 'Selling digital assets from Discord templates to Twitch panels' },
    tiktok: { name: 'TikTok', url: 'https://www.tiktok.com/@aylina_ina', emoji: '🎵', description: 'Updates, tutorials, and showcases' },
    instagram: { name: 'Instagram', url: 'https://www.instagram.com/aylina_inaa/', emoji: '📸', description: 'Reposts from TikTok till I find what direction I want to go with ig' },
    youtube: { name: 'YouTube', url: 'https://youtube.com/@aylina_ina?si=hc0BNPH---r-PkVz', emoji: '🎬', description: 'Long format tutorials and speed creates' },
    pinterest: { name: 'Pinterest', url: 'https://www.pinterest.com/aylina_ina/', emoji: '📌', description: '700k monthly views sharing my Discord server templates!!' },
    bluesky: { name: 'Bluesky', url: 'https://bsky.app/profile/aylina-ina.bsky.social', emoji: '🦋', description: 'Secondary portfolio' },
    twitter: { name: 'Twitter/X', url: 'https://x.com/aylina_ina', emoji: '🐦', description: 'Portfolio' },
    threads: { name: 'Threads', url: 'https://www.threads.com/@aylina_inaa', emoji: '🧵', description: 'Follow my ecommerce journey as a business major' },
    linktree: { name: 'Linktree', url: 'https://linktr.ee/aylina_ina', emoji: '🔗', description: 'My most in-demand links. If any links change, they\'ll be updated on Linktree first!' }
  }
};
