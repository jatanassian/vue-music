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
      if (this.sound instanceof Howl) {
        this.sound.unload();
      }

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

      this.songProgress = (this.sound.seek() / this.sound.duration()) * 100;

      if (this.sound.playing()) {
        requestAnimationFrame(this.setProgress);
      }
    },
    updateProgress(event) {
      if (!this.sound.playing) {
        return;
      }

      const { x, width } = event.currentTarget.getBoundingClientRect();
      // event.clientX is the X position of the click in the document
      // x is the distance between the left side of the player element and the left side of the document
      // We can calculate clickX, whick is the X position of the click relative to the player element
      const clickX = event.clientX - x;
      // Then we can calculate the amount of seconds that X position represents on the player
      const percentage = clickX / width;
      const seconds = this.sound.duration() * percentage;

      // Update the position
      this.sound.seek(seconds);
      this.sound.once('seek', this.setProgress);
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
