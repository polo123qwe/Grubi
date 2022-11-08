const { SlashCommandBuilder } = require("discord.js");
const SongQueueManager = require("../utils/SongQueueManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("shuffled Q"),
    async execute(interaction) {
        SongQueueManager.shuffle(interaction.guildId);
        await interaction.reply({
            content: "Playlist shuffled!",
            ephemeral: true,
        })

    },
};


