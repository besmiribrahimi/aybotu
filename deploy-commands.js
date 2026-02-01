const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    const commands = [];
    const commandsPath = path.join(__dirname, 'commands');
    const adminPath = path.join(commandsPath, 'admin');
    const memberPath = path.join(commandsPath, 'member');

    const loadCommands = (dirPath) => {
      if (fs.existsSync(dirPath)) {
        const commandFiles = fs.readdirSync(dirPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
          const filePath = path.join(dirPath, file);
          const command = require(filePath);
          if ('data' in command) {
            commands.push(command.data.toJSON());
            console.log(`[DEPLOY] Loaded: ${command.data.name}`);
          }
        }
      }
    };

    loadCommands(adminPath);
    loadCommands(memberPath);

    // Deploy to guild for instant availability (recommended)
    if (process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands },
      );
      console.log(`✓ Deployed ${commands.length} guild command(s) to ${process.env.GUILD_ID}.`);

      // Clear global commands to avoid duplicates
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: [] },
      );
      console.log('✓ Cleared global commands.');
    } else {
      console.log('⚠️  GUILD_ID not set; deploying globally instead.');
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands },
      );
      console.log(`✓ Deployed ${commands.length} global command(s).`);
    }
  } catch (error) {
    console.error(error);
  }
})();
