import { defineStore } from "pinia";
import { Howl } from "howler";

export default defineStore("song", {
  state: () => ({
    currentSong: {},
    audio: {},
  }),
  getters: {
    isAudioPlaying(state) {
      if (state.audio.playing) return state.audio.playing();
      return false;
    },
  },
  actions: {
    async newSong(song) {
      this.currentSong = song;

      this.audio = new Howl({
        src: [song.url],
        html5: true,
      });

      this.audio.play();
    },
    async toggleAudio() {
      if (!this.audio.playing) return;

      if (this.audio.playing()) this.audio.pause();
      else this.audio.play();
    },
  },
});
