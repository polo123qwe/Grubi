const { SlashCommandBuilder } = require("discord.js");


module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips current song"),
  async execute(interaction) {
    return interaction.reply({ content: "Not implemented!", ephemeral: true });
  },
};
