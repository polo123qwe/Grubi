const { SlashCommandBuilder } = require("discord.js");

const SongQueueManager = require("../utils/SongQueueManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("voicejoin")
    .setDescription("Join VC"),
  async execute(interaction) {
    if (!interaction.member.voice.channel) {
        return interaction.reply({ content: "You are not connected to a voice channel!", ephemeral: true });
    }
    // channel.joineable
    console.log("Connecting to", interaction.member.voice.channel.name);

    await SongQueueManager.createAudioPlayer(interaction.guild, interaction.member.voice.channel.id)

    return interaction.reply({ content: "Success!", ephemeral: true });
  },
};
