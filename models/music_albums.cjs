const mongoose = require("mongoose");

//Data schema

const songSchema = new mongoose.Schema({
  songId: Number,
  title: String,
  artist: String,
  file: {
    data: Buffer,
    song_url: String,
    contentType: String,
  },
  duration: {
    type: Number,
  },
  listens: {
    type: Number,
  },
  album: {
    album_name: String,
    album_id: Number,
  },
});

const musicAlbumsSchema = new mongoose.Schema({
  albumId: Number,
  artist: String,
  genre: String,
  title: String,
  cover: {
    image: {
      data: Buffer,
      image_url: String,
      contentType: String,
    },
  },
  release_date: { type: Date, default: Date.now() },
  soundCloudLink: String,
  songs: {
    type: [songSchema],
  },
});

module.exports = mongoose.model("music_albums", musicAlbumsSchema);
