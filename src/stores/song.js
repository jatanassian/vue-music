import { defineStore } from "pinia";

export default defineStore("song", {
  state: () => ({
    currentSong: {},
  }),
  actions: {
    async newSong(song) {
      this.currentSong = song;
    },
  },
});
