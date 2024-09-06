import { defineStore } from 'pinia';

export default defineStore('song', {
  state: () => ({
    currentSong: {}
  }),
  actions: {
    setSong(song) {
      this.currentSong = song;
    }
  }
});
