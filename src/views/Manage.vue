<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <Upload @add-song="addSong" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <SongItem
              v-for="(song, index) in songs"
              :key="song.id"
              :song="song"
              :song-index="index"
              @update-song="updateSong"
              @delete-song="deleteSong"
              @change="unsavedFlag = true"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Upload from '@/components/Upload.vue';
import SongItem from '@/components/SongItem.vue';
import { getSongsByUser } from '@/utils/firebase';

export default {
  name: 'Manage',
  components: { Upload, SongItem },
  data() {
    return {
      songs: [],
      unsavedFlag: false
    };
  },
  async created() {
    this.songs = await getSongsByUser();
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      const leave = confirm('You have unsaved changes. Are you sure you want to leave?');
      next(leave);
    }
  },
  methods: {
    addSong(song) {
      this.songs.push(song);
    },
    updateSong(index, values) {
      this.songs[index] = { ...this.songs[index], ...values };
      this.unsavedFlag = false;
    },
    deleteSong(id) {
      this.songs = this.songs.filter((song) => song.id !== id);
    }
  }
};
</script>
