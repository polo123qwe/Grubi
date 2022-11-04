const { resolve } = require("path");
const { readdir } = require("fs").promises;
const fs = require("node:fs");
const path = require("node:path");

async function* getFilesRecursive(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFilesRecursive(res);
      yield [res, true];
    } else if (res.match(".mp3|.flac")) {
      yield [res, false];
    }
  }
}

async function getFiles(dir) {
    
}

class SongsDB {
  constructor() {
    this.rootPath = "";
    this.dirs = [];
    this.songs = [];
  }

  async populateDB(rootPath) {
    this.rootPath = rootPath;

    for await (const f of getFilesRecursive(rootPath)) {
      const element = f[0].replace(rootPath, ""); // Remove the rootpath from the filename
      if (f[1]) this.dirs.push(element);
      else this.songs.push(element);
    }
    console.log(
      `There are ${this.songs.length} songs and ${this.dirs.length} directories.`
    );
  }

  searchSong(songName) {
    if (songName == null) return [];
    return this.songs.filter((dir) =>
      dir.toLowerCase().includes(songName.toLowerCase())
    );
  }

  searchPlaylist(playlistName) {
    if (!playlistName == null) return [];
    return this.dirs.filter((dir) =>
      dir.toLowerCase().includes(playlistName.toLowerCase())
    );
  }

  getFullPath(partialPath) {
    return path.join(this.rootPath, partialPath);
  }
}

module.exports = new SongsDB();
