const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a given song")
    .addStringOption((option) =>
      option.setName("song").setDescription("Name of the song to play")
    ),
  async execute(interaction) {
    const songName = interaction.options.getString("song");

    console.log("Song name", songName);

    // console.log("Connecting to", interaction.member.voice.channel.name);

    // const connection = getVoiceConnection(interaction.guildId);
    // if (oldConnection) {
    //   oldConnection.destroy();
    //   console.log("Disconnecting from previous channel");
    // }

    return interaction.reply({ content: "Not implemented!", ephemeral: true });
  },
};
