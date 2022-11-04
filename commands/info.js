const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Prints information of currently playing track"),
  async execute(interaction) {
    return interaction.reply({ content: "Not implemented!", ephemeral: true });
  },
};
