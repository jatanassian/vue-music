import { defineStore } from 'pinia';
import { Howl } from 'howler';
import { formatTime } from '@/utils/helpers';

export default defineStore('song', {
  state: () => ({
    currentSong: {},
    audio: {},
    time: '00.00',
    duration: '00.00',
    songProgress: 0
  }),
  actions: {
    setSong(song) {
      if (this.audio instanceof Howl) {
        this.audio.unload();
      }

      this.currentSong = song;

      this.audio = new Howl({
        src: song.url,
        html5: true,
        onplay: () => requestAnimationFrame(this.setProgress)
      });

      this.audio.play();
    },
    toggleAudio() {
      if (this.audio.playing) {
        this.audio.playing() ? this.audio.pause() : this.audio.play();
      }
    },
    setProgress() {
      this.time = formatTime(this.audio.seek());
      this.duration = formatTime(this.audio.duration());

      this.songProgress = (this.audio.seek() / this.audio.duration()) * 100;

      if (this.audio.playing()) {
        requestAnimationFrame(this.setProgress);
      }
    },
    updateProgress(event) {
      if (!this.audio.playing) {
        return;
      }

      const { x, width } = event.currentTarget.getBoundingClientRect();
      // event.clientX is the X position of the click in the document
      // x is the distance between the left side of the player element and the left side of the document
      // We can calculate clickX, whick is the X position of the click relative to the player element
      const clickX = event.clientX - x;
      // Then we can calculate the amount of seconds that X position represents on the player
      const percentage = clickX / width;
      const seconds = this.audio.duration() * percentage;

      // Update the position
      this.audio.seek(seconds);
      this.audio.once('seek', this.setProgress);
    }
  },
  getters: {
    currentSongId: (state) => {
      return state.currentSong.id;
    },
    isPlaying: (state) => {
      if (state.audio.playing) {
        return state.audio.playing();
      }
      return false;
    }
  }
});
