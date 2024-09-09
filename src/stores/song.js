import { defineStore } from 'pinia';
import { Howl } from 'howler';

export default defineStore('song', {
  state: () => ({
    currentSong: {},
    sound: {}
  }),
  actions: {
    setSong(song) {
      this.currentSong = song;

      this.sound = new Howl({
        src: song.url,
        html5: true
      });

      this.sound.play();
    },
    toggleAudio() {
      if (this.sound.playing) {
        this.sound.playing() ? this.sound.pause() : this.sound.play();
      }
    }
  },
  getters: {
    isPlaying: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }
      return false;
    }
  }
});
