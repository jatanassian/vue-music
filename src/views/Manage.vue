<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <Upload />
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
import { getSongs } from '@/utils/firebase';

export default {
  name: 'Manage',
  components: { Upload, SongItem },
  data() {
    return {
      songs: []
    };
  },
  async created() {
    this.songs = await getSongs();
  },
  methods: {
    updateSong(index, values) {
      this.songs[index] = { ...this.songs[index], ...values };
    },
    deleteSong(id) {
      this.songs = this.songs.filter((song) => song.id !== id);
    }
  }
};
</script>
