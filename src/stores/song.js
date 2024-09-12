import { defineStore } from 'pinia';
import { Howl } from 'howler';
import { formatTime } from '@/utils/helpers';

export default defineStore('song', {
  state: () => ({
    currentSong: {},
    sound: {},
    time: '00.00',
    duration: '00.00',
    songProgress: 0
  }),
  actions: {
    setSong(song) {
      this.currentSong = song;

      this.sound = new Howl({
        src: song.url,
        html5: true,
        onplay: () => requestAnimationFrame(this.setProgress)
      });

      this.sound.play();
    },
    toggleAudio() {
      if (this.sound.playing) {
        this.sound.playing() ? this.sound.pause() : this.sound.play();
      }
    },
    setProgress() {
      this.time = formatTime(this.sound.seek());
      this.duration = formatTime(this.sound.duration());

      this.songProgress = `${(this.sound.seek() / this.sound.duration()) * 100}%`;

      if (this.sound.playing()) {
        requestAnimationFrame(this.setProgress);
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
