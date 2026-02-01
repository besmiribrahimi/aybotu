const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUserRank, getUserStats, getLeaderboard } = require('../../utils/messageStats');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('View your message rank and stats'),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const userId = interaction.user.id;
    
    // Get user's stats
    const userRank = getUserRank(userId, guildId);
    const userStats = getUserStats(userId, guildId);
    const userMessages = userStats?.messages || 0;

    // Get total users on leaderboard
    const totalUsers = getLeaderboard(guildId, 1000).length;

    if (userMessages === 0) {
      return interaction.reply({ 
        content: '📊 You haven\'t sent any messages yet! Start chatting to get ranked.', 
        ephemeral: true 
      });
    }

    // Determine rank display
    let rankEmoji = '⭐';
    if (userRank === 1) rankEmoji = '👑';
    else if (userRank === 2) rankEmoji = '🥈';
    else if (userRank === 3) rankEmoji = '🥉';
    else if (userRank <= 10) rankEmoji = '✨';

    const embed = new EmbedBuilder()
      .setColor('#FFB7C5')
      .setTitle('♡   .   —  ꒰ Your Rank ꒱')
      .setDescription(`୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧`)
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        { 
          name: '　　　　　　𓂃 ִֶָ𐀔　Stats　𓂃 ִֶָ𐀔', 
          value: `\n${rankEmoji} **Rank:** #${userRank} of ${totalUsers}\n\n💬 **Messages:** ${userMessages.toLocaleString()}\n\n👤 **User:** ${interaction.user.username}`,
          inline: false 
        }
      )
      .setFooter({ text: '୭ ˚. ᵎᵎ 🍥 °  Aylina\'s Disc — Keep chatting to climb the ranks!' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
