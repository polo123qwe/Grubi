const {
  SlashCommandBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
} = require("discord.js");

const wait = require("node:timers/promises").setTimeout;

const SongsDB = require("../utils/SongsDB");
const SongQueueManager = require("../utils/SongQueueManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playlist")
    .setDescription("Plays a playlist")
    .addStringOption((option) =>
      option.setName("playlist").setDescription("Name of the playlist to play")
    ),
  async execute(interaction) {
    if (!interaction.member.voice.channel) {
        return interaction.reply({ content: "You are not connected to a voice channel!", ephemeral: true });
    }

    const playlistName = interaction.options.getString("playlist");

    const results = SongsDB.searchPlaylist(playlistName);

    if (results.length == 0) {
      await interaction.reply({
        content: "No playlist found!",
        ephemeral: true,
      });
      await wait(4000);
      await interaction.deleteReply();
      return;
    }

    if (results.length == 1) {
      // Play the song
      SongQueueManager.addPlaylistToGuildQueue(results[0], interaction);

      await interaction.reply({
        content: `Playing playlist ${results[0]}`,
      });
      return;
    }

    if (results.length > 1) {
      await playlistSelector(interaction, results);
    }
  },
};

async function playlistSelector(interaction, results) {
  const options = results.map((playlistName) => {
    return {
      label: playlistName,
      description: playlistName,
      value: playlistName,
    };
  });

  const row = new ActionRowBuilder().addComponents(
    new SelectMenuBuilder()
      .setCustomId("select")
      .setPlaceholder("Nothing selected")
      .addOptions(options)
  );

  await interaction.reply({
    content: "Multiple results found!",
    components: [row],
  });
}