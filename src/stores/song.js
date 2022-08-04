import { defineStore } from "pinia";
import { Howl } from "howler";
import helper from "@/includes/helpers";

export default defineStore("song", {
  state: () => ({
    currentSong: {},
    audio: {},
    duration: "0:00",
    seek: "0:00",
    progress: "0%",
  }),
  getters: {
    isAudioPlaying(state) {
      if (state.audio.playing) return state.audio.playing();
      return false;
    },
  },
  actions: {
    async newSong(song) {
      if (this.audio instanceof Howl) this.audio.unload();

      this.currentSong = song;

      this.audio = new Howl({
        src: [song.url],
        html5: true,
      });

      this.audio.play();

      this.audio.on("play", () => requestAnimationFrame(this.updateProgress));
    },
    async toggleAudio() {
      if (!this.audio.playing) return;

      if (this.audio.playing()) this.audio.pause();
      else this.audio.play();
    },
    updateProgress() {
      this.seek = helper.formatTime(this.audio.seek());
      this.duration = helper.formatTime(this.audio.duration());

      this.progress = `${(this.audio.seek() / this.audio.duration()) * 100}%`;

      if (this.audio.playing) requestAnimationFrame(this.updateProgress);
    },
  },
});
