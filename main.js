const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");

const { token, client_id, rootPath } = require("./config.json");
const songsDB = require("./utils/SongsDB");
const songQueue = require("./utils/SongQueueManager");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Load the commands from the files
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => {
  console.log("Ready!");
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isSelectMenu()) return;

  if (interaction.customId === "select") {
    songQueue.addPlaylistToGuildQueue(interaction.values[0], interaction);

    await interaction.update({
      content: `Selected playlist ${interaction.values[0]}`,
      components: [],
    });
  }
});

(async () => {
  await songsDB.populateDB(rootPath);
  client.login(token);
})();
