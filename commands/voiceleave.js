const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("voiceleave")
    .setDescription("Leave VC"),
  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guildId);
    if (connection) {
      connection.destroy();
      return interaction.reply({ content: "Success!", ephemeral: true });
    }

    return interaction.reply({ content: "Not connected!", ephemeral: true });
  },
};
