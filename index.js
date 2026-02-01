const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database connection
const { connectDB, disconnectDB } = require('./database');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

client.commands = new Collection();
client.events = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const adminPath = path.join(commandsPath, 'admin');
const memberPath = path.join(commandsPath, 'member');

const loadCommands = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    const commandFiles = fs.readdirSync(dirPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const filePath = path.join(dirPath, file);
      const command = require(filePath);
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`[COMMAND] Loaded: ${command.data.name}`);
      }
    }
  }
};

loadCommands(adminPath);
loadCommands(memberPath);

const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
      console.log(`[EVENT] Loaded (once): ${event.name}`);
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
      console.log(`[EVENT] Loaded: ${event.name}`);
    }
  }
}

// Connect to database then login to Discord
const startBot = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Login to Discord
    await client.login(process.env.TOKEN);
  } catch (error) {
    console.error('Failed to start bot:', error);
    process.exit(1);
  }
};

startBot();

// Graceful shutdown for PM2 / system signals
const cleanup = async () => {
  try {
    console.log('Shutting down: destroying Discord client...');
    await client.destroy();
    await disconnectDB();
  } catch (err) {
    console.error('Error during shutdown', err);
  } finally {
    // allow PM2 to exit the process
    process.exit(0);
  }
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // optionally exit after logging
});
