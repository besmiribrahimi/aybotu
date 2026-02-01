# Aylina Bot

𝕬𝖞𝖑𝖎𝖓𝖆 ⋆˚꩜｡ _Aylina's Disc._ ┈ ┈

♡   .   —  ꒰ 𝕬𝖞𝖑𝖎𝖓𝖆 — A versatile Discord bot built with Discord.js ꒱

✧˖°. Features: ⟢ Moderation • Giveaways • Ticket Panels • Auto-responses • Welcome / Mod Logs • Utility Commands

୭ ˚. ᵎᵎ 🍥 ° Aylina's Disc — by yubin

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create a `.env` file** with:
   ```
   TOKEN=your_bot_token_here
   CLIENT_ID=your_client_id_here
   GUILD_ID=your_guild_id_here
   ```

3. **Start the bot:**
   ```bash
   npm start
   ```

   Or in development with auto-reload:
   ```bash
   npm run dev
   ```

## Project Structure

```
vincent bot/
├── commands/          # Slash commands
├── events/           # Bot events
├── index.js          # Main bot file
├── deploy-commands.js # Command deployment
├── package.json
├── .env              # Environment variables
└── .gitignore
```

## Creating Commands

Create a new file in the `commands/` folder:

```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('commandname')
    .setDescription('Command description'),
  async execute(interaction, client) {
    await interaction.reply('Command executed!');
  },
};
```

## Creating Events

Create a new file in the `events/` folder:

```javascript
module.exports = {
  name: 'eventname',
  once: false,
  execute(...args) {
    // Event logic
  },
};
```

## Getting Bot Token

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create New Application
3. Go to "Bot" tab and click "Add Bot"
4. Under TOKEN, click "Copy"
5. Paste in `.env` file
