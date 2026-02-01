const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { getTriggers, setTrigger, removeTrigger, getTriggerCount } = require('../../utils/autoResponder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autorespond')
    .setDescription('Manage autoresponder triggers')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add a new autoresponder trigger')
        .addStringOption(option =>
          option.setName('trigger')
            .setDescription('The word/phrase to trigger a response')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('response')
            .setDescription('The response message to send')
            .setRequired(true))
        .addBooleanOption(option =>
          option.setName('exact')
            .setDescription('Require exact match? (Default: false - triggers if word appears anywhere)')
            .setRequired(false))
        .addBooleanOption(option =>
          option.setName('embed')
            .setDescription('Send response as a cute embed? (Default: false)')
            .setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove an autoresponder trigger')
        .addStringOption(option =>
          option.setName('trigger')
            .setDescription('The trigger word/phrase to remove')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('edit')
        .setDescription('Edit an existing autoresponder trigger')
        .addStringOption(option =>
          option.setName('trigger')
            .setDescription('The trigger word/phrase to edit')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('response')
            .setDescription('The new response message')
            .setRequired(false))
        .addBooleanOption(option =>
          option.setName('exact')
            .setDescription('Require exact match?')
            .setRequired(false))
        .addBooleanOption(option =>
          option.setName('embed')
            .setDescription('Send response as a cute embed?')
            .setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('List all autoresponder triggers'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('info')
        .setDescription('Get info about a specific trigger')
        .addStringOption(option =>
          option.setName('trigger')
            .setDescription('The trigger to get info about')
            .setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'add': {
        const trigger = interaction.options.getString('trigger');
        const response = interaction.options.getString('response');
        const exactMatch = interaction.options.getBoolean('exact') || false;
        const embedResponse = interaction.options.getBoolean('embed') || false;

        // Check if trigger already exists
        const existing = getTriggers(interaction.guild.id);
        if (existing[trigger.toLowerCase()]) {
          return interaction.reply({
            content: '˚ ༘♡ That trigger already exists! Use `/autorespond edit` to modify it~ ˖°',
            ephemeral: true
          });
        }

        const success = setTrigger(interaction.guild.id, trigger, response, {
          exactMatch,
          embedResponse,
          createdBy: interaction.user.tag,
          createdAt: new Date().toISOString()
        });

        if (success) {
          const embed = new EmbedBuilder()
            .setColor('#FFD1DC')
            .setTitle('˚ ༘♡ ⋆˙ Autoresponder Added ⋆˙♡ ༘˚')
            .setDescription(`✧˖°. ─────── .°˖✧`)
            .addFields(
              { name: '꒰ა Trigger ໒꒱', value: `\`${trigger}\``, inline: true },
              { name: '꒰ა Response ໒꒱', value: response.substring(0, 100) + (response.length > 100 ? '...' : ''), inline: true },
              { name: '꒰ა Settings ໒꒱', value: `Exact Match: ${exactMatch ? '✓' : '✗'}\nEmbed: ${embedResponse ? '✓' : '✗'}`, inline: false }
            )
            .setFooter({ text: '˖ ݁𖥔.° Autoresponder will now trigger on this word!' })
            .setTimestamp();

          await interaction.reply({ embeds: [embed] });
        } else {
          await interaction.reply({ content: '(╥﹏╥) Failed to add trigger. Please try again!', ephemeral: true });
        }
        break;
      }

      case 'remove': {
        const trigger = interaction.options.getString('trigger');
        
        const success = removeTrigger(interaction.guild.id, trigger);

        if (success) {
          const embed = new EmbedBuilder()
            .setColor('#FFD1DC')
            .setTitle('˚ ༘♡ ⋆˙ Autoresponder Removed ⋆˙♡ ༘˚')
            .setDescription(`✧˖°. ─────── .°˖✧\n\nTrigger \`${trigger}\` has been removed~`)
            .setFooter({ text: '˖ ݁𖥔.° The bot will no longer respond to this trigger!' })
            .setTimestamp();

          await interaction.reply({ embeds: [embed] });
        } else {
          await interaction.reply({ 
            content: '˚ ༘♡ That trigger doesn\'t exist! Use `/autorespond list` to see all triggers~ ˖°', 
            ephemeral: true 
          });
        }
        break;
      }

      case 'edit': {
        const trigger = interaction.options.getString('trigger');
        const newResponse = interaction.options.getString('response');
        const exactMatch = interaction.options.getBoolean('exact');
        const embedResponse = interaction.options.getBoolean('embed');

        const existing = getTriggers(interaction.guild.id);
        const triggerData = existing[trigger.toLowerCase()];

        if (!triggerData) {
          return interaction.reply({
            content: '˚ ༘♡ That trigger doesn\'t exist! Use `/autorespond add` to create it~ ˖°',
            ephemeral: true
          });
        }

        // Update only provided options
        const success = setTrigger(interaction.guild.id, trigger, newResponse || triggerData.response, {
          exactMatch: exactMatch !== null ? exactMatch : triggerData.exactMatch,
          embedResponse: embedResponse !== null ? embedResponse : triggerData.embedResponse,
          createdBy: triggerData.createdBy,
          createdAt: triggerData.createdAt
        });

        if (success) {
          const embed = new EmbedBuilder()
            .setColor('#FFD1DC')
            .setTitle('˚ ༘♡ ⋆˙ Autoresponder Edited ⋆˙♡ ༘˚')
            .setDescription(`✧˖°. ─────── .°˖✧\n\nTrigger \`${trigger}\` has been updated~`)
            .addFields(
              { name: '꒰ა Response ໒꒱', value: (newResponse || triggerData.response).substring(0, 100) + ((newResponse || triggerData.response).length > 100 ? '...' : ''), inline: false },
              { name: '꒰ა Settings ໒꒱', value: `Exact Match: ${(exactMatch !== null ? exactMatch : triggerData.exactMatch) ? '✓' : '✗'}\nEmbed: ${(embedResponse !== null ? embedResponse : triggerData.embedResponse) ? '✓' : '✗'}`, inline: false }
            )
            .setFooter({ text: '˖ ݁𖥔.° Changes saved!' })
            .setTimestamp();

          await interaction.reply({ embeds: [embed] });
        } else {
          await interaction.reply({ content: '(╥﹏╥) Failed to edit trigger. Please try again!', ephemeral: true });
        }
        break;
      }

      case 'list': {
        const triggers = getTriggers(interaction.guild.id);
        const triggerList = Object.entries(triggers);

        if (triggerList.length === 0) {
          return interaction.reply({
            content: '˚ ༘♡ No autoresponders set up yet! Use `/autorespond add` to create one~ ˖°',
            ephemeral: true
          });
        }

        const embed = new EmbedBuilder()
          .setColor('#FFD1DC')
          .setTitle('˚ ༘♡ ⋆˙ Autoresponders List ⋆˙♡ ༘˚')
          .setDescription(`✧˖°. ─────── .°˖✧\n\n**${triggerList.length}** autoresponders configured~`);

        // Add triggers (max 25 fields)
        const displayTriggers = triggerList.slice(0, 24);
        for (const [key, data] of displayTriggers) {
          const flags = [];
          if (data.exactMatch) flags.push('◈ Exact');
          if (data.embedResponse) flags.push('◈ Embed');
          
          embed.addFields({
            name: `꒰ა \`${data.trigger}\` ໒꒱`,
            value: `${data.response.substring(0, 50)}${data.response.length > 50 ? '...' : ''}\n${flags.length > 0 ? flags.join(' • ') : '◈ Contains match'}`,
            inline: true
          });
        }

        if (triggerList.length > 24) {
          embed.addFields({
            name: '✧ Note',
            value: `And ${triggerList.length - 24} more triggers...`,
            inline: false
          });
        }

        embed.setFooter({ text: '˖ ݁𖥔.° Use /autorespond info <trigger> for details!' });
        embed.setTimestamp();

        await interaction.reply({ embeds: [embed] });
        break;
      }

      case 'info': {
        const trigger = interaction.options.getString('trigger');
        const triggers = getTriggers(interaction.guild.id);
        const triggerData = triggers[trigger.toLowerCase()];

        if (!triggerData) {
          return interaction.reply({
            content: '˚ ༘♡ That trigger doesn\'t exist! Use `/autorespond list` to see all triggers~ ˖°',
            ephemeral: true
          });
        }

        const embed = new EmbedBuilder()
          .setColor('#FFD1DC')
          .setTitle(`˚ ༘♡ ⋆˙ Trigger Info ⋆˙♡ ༘˚`)
          .setDescription(`✧˖°. ─────── .°˖✧`)
          .addFields(
            { name: '꒰ა Trigger ໒꒱', value: `\`${triggerData.trigger}\``, inline: true },
            { name: '꒰ა Match Type ໒꒱', value: triggerData.exactMatch ? 'Exact Match' : 'Contains', inline: true },
            { name: '꒰ა Response Type ໒꒱', value: triggerData.embedResponse ? 'Embed' : 'Text', inline: true },
            { name: '꒰ა Response ໒꒱', value: triggerData.response, inline: false },
            { name: '꒰ა Created By ໒꒱', value: triggerData.createdBy, inline: true },
            { name: '꒰ა Created At ໒꒱', value: new Date(triggerData.createdAt).toLocaleDateString(), inline: true }
          )
          .setFooter({ text: '˖ ݁𖥔.° Use /autorespond edit to modify!' })
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
        break;
      }
    }
  },
};
