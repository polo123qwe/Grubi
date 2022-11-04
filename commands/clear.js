const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clears queue"),
  async execute(interaction) {
    return interaction.reply({ content: "Not implemented!", ephemeral: true });
  },
};
