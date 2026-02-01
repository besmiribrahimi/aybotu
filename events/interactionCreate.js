const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionsBitField } = require('discord.js');
const ticketConfig = require('../utils/ticketConfig.js');
const fs = require('fs');
const path = require('path');



// Helper to get help channel
const getHelpChannel = (guildId) => {
  try {
    const configPath = path.join(__dirname, '../helpConfig.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return config[guildId]?.helpChannelId;
    }
  } catch (err) {}
  return null;
};

module.exports = {
  name: 'interactionCreate',
  once: false,
  async execute(interaction, client) {
    // Handle slash commands
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: '❌ There was an error executing this command!', ephemeral: true }).catch(() => {});
      }
      return;
    }

    // Handle modal submissions
    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'helpRequestModal') {
        const requestType = interaction.fields.getTextInputValue('requestType');
        const description = interaction.fields.getTextInputValue('requestDescription');
        const budget = interaction.fields.getTextInputValue('requestBudget') || 'Not specified';

        const embed = new EmbedBuilder()
          .setColor('#FFB7C5')
          .setTitle('♡   .   —  ꒰ New Help Request ꒱')
          .setDescription(`୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧\n\n**${interaction.user}** is looking for help!`)
          .addFields(
            { name: '⊹ ࣪✧ Type of Help ˖ °', value: requestType, inline: true },
            { name: '⊹ ࣪✧ Budget ˖ °', value: budget, inline: true },
            { name: '⊹ ࣪✧ Description ˖ °', value: description, inline: false }
          )
          .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
          .setFooter({ text: '୭ ˚. ᵎᵎ 🍥 °  Aylina\'s Disc — If you can help, reach out to them!' })
          .setTimestamp();

        // Check if help channel is configured
        const helpChannelId = getHelpChannel(interaction.guild.id);
        if (helpChannelId) {
          const helpChannel = interaction.guild.channels.cache.get(helpChannelId);
          if (helpChannel) {
            await helpChannel.send({ embeds: [embed] });
            await interaction.reply({ content: '⊹ ࣪✧ Your help request has been submitted! ˖ °', ephemeral: true });
            return;
          }
        }
        
        // Fallback to current channel if no help channel set
        await interaction.reply({ embeds: [embed] });
        return;
      }
    }

    // Handle button interactions
    if (interaction.isButton()) {
      // Create Ticket Button
      if (interaction.customId === 'create_ticket') {
        // Check if user already has an open ticket
        if (ticketConfig.hasOpenTicket(interaction.user.id)) {
          return interaction.reply({ content: '⊹ ࣪✧ You already have an open ticket! ˖ °', ephemeral: true });
        }

        const ticketNumber = ticketConfig.getNextTicketNumber();
        const ticketName = `ticket-${ticketNumber.toString().padStart(4, '0')}`;

        try {
          // Create ticket channel
          const ticketChannel = await interaction.guild.channels.create({
            name: ticketName,
            type: ChannelType.GuildText,
            permissionOverwrites: [
              {
                id: interaction.guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
              },
              {
                id: interaction.user.id,
                allow: [
                  PermissionsBitField.Flags.ViewChannel,
                  PermissionsBitField.Flags.SendMessages,
                  PermissionsBitField.Flags.ReadMessageHistory,
                ],
              },
            ],
          });

          // Save ticket info
          ticketConfig.addOpenTicket(ticketChannel.id, interaction.user.id, ticketNumber);

          // Send embed in ticket channel
          const ticketEmbed = new EmbedBuilder()
            .setColor('#FFB7C5')
            .setTitle(`♡   .   —  ꒰ Aylina's Disc — Ticket #${ticketNumber.toString().padStart(4, '0')} ꒱`)
            .setDescription(`୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧\n\n　　　　　　𓂃 ִֶָ𐀔　Welcome!　𓂃 ִֶָ𐀔\n\nHello ${interaction.user}! ♡\nThank you for reaching out to Aylina's Disc. Please describe your issue and our staff will assist you shortly!`)
            .addFields(
              { name: '⊹ ࣪✧ Opened By ˖ °', value: `${interaction.user.tag}`, inline: true },
              { name: '⊹ ࣪✧ Ticket Number ˖ °', value: `#${ticketNumber.toString().padStart(4, '0')}`, inline: true }
            )
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: '୭ ˚. ᵎᵎ 🍥 °  Aylina\'s Disc — Staff will be with you soon!' })
            .setTimestamp();

          const closeRow = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('Close Ticket')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🔒')
            );

          await ticketChannel.send({ content: `${interaction.user}`, embeds: [ticketEmbed], components: [closeRow] });

          await interaction.reply({ content: `⊹ ࣪✧ Your ticket has been created: ${ticketChannel} ˖ °`, ephemeral: true });
        } catch (error) {
          console.error('Error creating ticket:', error);
          await interaction.reply({ content: '⊹ ࣪✧ Failed to create ticket. Please try again! ˖ °', ephemeral: true });
        }
      }

      // Close Ticket Button
      if (interaction.customId === 'close_ticket') {
        // Check if user is admin
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
          return interaction.reply({ content: '⊹ ࣪✧ Only administrators can close tickets! ˖ °', ephemeral: true });
        }

        const ticketInfo = ticketConfig.getOpenTicket(interaction.channel.id);
        
        if (!ticketInfo) {
          return interaction.reply({ content: '⊹ ࣪✧ This is not a valid ticket channel! ˖ °', ephemeral: true });
        }

        await interaction.reply({ content: '♡ Closing ticket in 5 seconds... Thank you for reaching out! ˖ °' });

        setTimeout(async () => {
          try {
            ticketConfig.removeOpenTicket(interaction.channel.id);
            await interaction.channel.delete();
          } catch (error) {
            console.error('Error closing ticket:', error);
          }
        }, 5000);
      }

      // Giveaway Entry Button - Normal & Exclusive Mode (persistent)
      if (interaction.customId === 'giveaway_normal' || interaction.customId.startsWith('giveaway_exclusive_')) {
        const messageId = interaction.message.id;
        let requiredRoleId = null;
        if (interaction.customId.startsWith('giveaway_exclusive_')) {
          requiredRoleId = interaction.customId.replace('giveaway_exclusive_', '');
          // Check if user has the required role
          if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({
              content: '✨ This is an exclusive giveaway! You need the required role to enter~ ˖ °',
              ephemeral: true
            });
          }
        }

        // Use persistent manager
        const giveawayManager = require('../utils/giveawayMenager.js');
        const giveaway = giveawayManager.getGiveaway(messageId);
        if (!giveaway) {
          return interaction.reply({ content: 'This giveaway is no longer active.', ephemeral: true });
        }
        // Exclusive mode: check role in saved giveaway (extra safety)
        if (giveaway.mode === 'exclusive' && giveaway.requiredRole) {
          if (!interaction.member.roles.cache.has(giveaway.requiredRole)) {
            return interaction.reply({ content: 'You do not have the required role to join this giveaway.', ephemeral: true });
          }
        }
        // Add participant
        const added = giveawayManager.addParticipant(messageId, interaction.user.id);
        if (!added) {
          return interaction.reply({ content: interaction.customId === 'giveaway_normal' ? '🌸 You\'ve already entered this giveaway! ˖ °' : '✨ You\'ve already entered this exclusive giveaway! ˖ °', ephemeral: true });
        }
        return interaction.reply({ content: interaction.customId === 'giveaway_normal' ? '🎀 ♡ You\'ve entered the giveaway! Good luck! ˖ °' : '💎 ♡ You\'ve entered the exclusive giveaway! Good luck special member~ ˖ °', ephemeral: true });
      }
const giveawayManager = require('../utils/giveawayMenager.js'); // Adjust path if needed

module.exports = async (client, interaction) => {
  if (interaction.isButton()) {
    // Check if it's a giveaway button
    if (interaction.customId.startsWith('giveaway_')) {
      const giveaway = giveawayManager.getGiveaway(interaction.message.id);
      if (!giveaway) {
        return interaction.reply({ content: 'This giveaway is no longer active.', ephemeral: true });
      }

      // Exclusive mode: check role
      if (giveaway.mode === 'exclusive' && giveaway.requiredRole) {
        if (!interaction.member.roles.cache.has(giveaway.requiredRole)) {
          return interaction.reply({ content: 'You do not have the required role to join this giveaway.', ephemeral: true });
        }
      }

      // Add participant
      const added = giveawayManager.addParticipant(interaction.message.id, interaction.user.id);
      if (!added) {
        return interaction.reply({ content: 'You have already joined this giveaway!', ephemeral: true });
      }

      return interaction.reply({ content: 'You have entered the giveaway! Good luck!', ephemeral: true });
    }
  }

  // ...existing code for other interactions (commands, etc.)
};
      // Send All Links Button for Commissions
      if (interaction.customId === 'send_all_links') {
        const commissionsCommand = interaction.client.commands.get('commissions');
        const links = commissionsCommand?.socialLinks || getDefaultSocialLinks();
        
        let linksText = '୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧\n\n';
        linksText += '　　　　　　𓂃 ִֶָ𐀔　All My Links　𓂃 ִֶָ𐀔\n\n';
        
        for (const [key, link] of Object.entries(links)) {
          linksText += `${link.emoji} **${link.name}**\n`;
          linksText += `┊ ${link.description}\n`;
          linksText += `┊ ${link.url}\n\n`;
        }

        const linksEmbed = new EmbedBuilder()
          .setColor('#FFD1DC')
          .setTitle('♡   .   —  ꒰ 🔗 Aylina\'s Links 🔗 ꒱')
          .setDescription(linksText)
          .setFooter({ text: '୭ ˚. ᵎᵎ 🍥 °  Links updated as of rebranding! Check Linktree for latest~' })
          .setTimestamp();

        await interaction.reply({ embeds: [linksEmbed], ephemeral: true });
      }
    }

    // Handle Select Menu Interactions
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'aylina_socials') {
        const selected = interaction.values[0];
        const commissionsCommand = interaction.client.commands.get('commissions');
        const links = commissionsCommand?.socialLinks || getDefaultSocialLinks();
        const link = links[selected];

        if (link) {
          const linkEmbed = new EmbedBuilder()
            .setColor('#FFD1DC')
            .setTitle(`♡   .   —  ꒰ ${link.emoji} ${link.name} ꒱`)
            .setDescription(`୨୧ ⏔⏔⏔⏔♡⏔⏔⏔⏔ ୨୧\n\n${link.description}\n\n🔗 **Link:** ${link.url}`)
            .setFooter({ text: '୭ ˚. ᵎᵎ 🍥 °  Thank you for checking out my work!' })
            .setTimestamp();

          await interaction.reply({ embeds: [linkEmbed], ephemeral: true });
        }
      }
    }
  },
};

// Default social links fallback
function getDefaultSocialLinks() {
  return {
    kofi: { name: 'Ko-fi', url: 'https://ko-fi.com/aylina_ina', emoji: '☕', description: '600+ followers selling freebies, resources, and server templates' },
    etsy: { name: 'Etsy', url: 'https://etsy.com/shop/aylina', emoji: '🛒', description: 'Selling digital assets from Discord templates to Twitch panels' },
    tiktok: { name: 'TikTok', url: 'https://tiktok.com/@aylina', emoji: '🎵', description: 'Updates, tutorials, and showcases' },
    instagram: { name: 'Instagram', url: 'https://instagram.com/aylina', emoji: '📸', description: 'Reposts from TikTok till I find what direction I want to go with ig' },
    youtube: { name: 'YouTube', url: 'https://youtube.com/@aylina', emoji: '🎬', description: 'Long format tutorials and speed creates' },
    pinterest: { name: 'Pinterest', url: 'https://pinterest.com/aylina', emoji: '📌', description: '700k monthly views sharing my Discord server templates!!' },
    bluesky: { name: 'Bluesky', url: 'https://bsky.app/profile/aylina', emoji: '🦋', description: 'Secondary portfolio' },
    twitter: { name: 'Twitter/X', url: 'https://twitter.com/aylina', emoji: '🐦', description: 'Portfolio' },
    threads: { name: 'Threads', url: 'https://threads.net/@aylina', emoji: '🧵', description: 'Follow my ecommerce journey as a business major' },
    linktree: { name: 'Linktree', url: 'https://linktr.ee/aylina', emoji: '🔗', description: 'My most in-demand links. If any links change, they\'ll be updated on Linktree first!' }
  };
}
