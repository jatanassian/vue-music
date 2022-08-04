import { defineStore } from "pinia";
import { Howl } from "howler";
import helper from "@/includes/helpers";

export default defineStore("song", {
  state: () => ({
    currentSong: {},
    audio: {},
    duration: "0:00",
    seek: "0:00",
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

      this.audio.on("play", () => requestAnimationFrame(this.progress));
    },
    async toggleAudio() {
      if (!this.audio.playing) return;

      if (this.audio.playing()) this.audio.pause();
      else this.audio.play();
    },
    progress() {
      this.seek = helper.formatTime(this.audio.seek());
      this.duration = helper.formatTime(this.audio.duration());

      if (this.audio.playing) requestAnimationFrame(this.progress);
    },
  },
});
