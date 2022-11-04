const wait = require("node:timers/promises").setTimeout;
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  NoSubscriberBehavior,
  VoiceConnectionStatus,
  AudioPlayerStatus,
} = require("@discordjs/voice");

const songsDB = require("./SongsDB");

class SongQueueManager {
  constructor() {
    this.songQueues = {};
  }

  getGuildQueue(guildId) {
    if (this.songQueues[guildId] == null) {
      this.songQueues[guildId] = {
        queue: [],
        shuffle: false,
        subscription: null,
      };
    }
    return this.songQueues[guildId];
  }

  async addSongToGuildQueue(songPath, interaction) {
    const guildQueue = this.getGuildQueue(guildId);
    guildQueue.queue.push(songsDB.getFullPath(songPath));
  }

  async addPlaylistToGuildQueue(playlistPath, interaction) {
    const guildQueue = this.getGuildQueue(interaction.guildId);
    const songsToAdd = songsDB.songs.filter((songPath) =>
      songPath.includes(playlistPath) // CHANGE THIS SO IT DOES NOT SELECT THE SONGS IN SUBFOLDERS TOO
    );
    if (songsToAdd) {
      songsToAdd.forEach((song) =>
        guildQueue.queue.push(songsDB.getFullPath(song))
      );

      if (guildQueue.subscription == null) {
        this.createAudioPlayer(
          interaction.guild,
          interaction.member.voice.channel.id
        );
      } else if (
        guildQueue.subscription.player.state.status == AudioPlayerStatus.Idle
      ) {
        this.playNextSong(interaction.guildId);
      }
    }
  }

  createAudioPlayer(guild, channelId) {
    const oldConnection = getVoiceConnection(guild.id);
    if (oldConnection) {
      oldConnection.destroy();
      console.log("Disconnecting from previous channel");
    }

    const connection = joinVoiceChannel({
      channelId: channelId,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });

    console.log("Voice connection created!" /*, connection*/);

    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });
    player.stop();

    const subscription = connection.subscribe(player);
    this.addPlayerSubscription(subscription, guild.id);
  }

  addPlayerSubscription(subscription, guildId) {
    const guildQueue = this.getGuildQueue(guildId);
    guildQueue.subscription = subscription;

    subscription.player.on(AudioPlayerStatus.Idle, (oldState, newState) => {
      this.playNextSong(guildId);
    });
    subscription.player.on(AudioPlayerStatus.Playing, () => {
      console.log("Status changed to Playing!");
    });

    subscription.connection.on(VoiceConnectionStatus.Ready, () => {
      console.log("Ready to play audio!");
      // If there is already songs queued, start playing
      if (this.getGuildQueue(guildId).queue) {
        this.playNextSong(guildId);
      }
    });
  }

  async playNextSong(guildId) {
    const guildQueue = this.getGuildQueue(guildId);
    const nextSong = guildQueue.queue.shift();
    console.log("Now playing", nextSong)
    const resource = createAudioResource(nextSong);
    guildQueue.subscription.player.play(resource);
    await wait(5000);
    guildQueue.subscription.player.stop();
  }
}

module.exports = new SongQueueManager();
