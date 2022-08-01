<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <upload></upload>
      </div>
      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i
              class="fa fa-compact-disc float-right text-green-400 text-2xl"
            ></i>
          </div>
          <div class="p-6">
            <song-list-item
              v-for="(song, i) in songs"
              :key="song.id"
              :song="song"
              :index="i"
              :update-song="updateSong"
            ></song-list-item>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Upload from "@/components/manage/Upload.vue";
import SongListItem from "@/components/manage/SongListItem.vue";
import { songsCollection, auth } from "@/includes/firebase";

export default {
  name: "Manage",
  components: { Upload, SongListItem },
  data() {
    return {
      songs: [],
    };
  },
  methods: {
    // Fetch user's songs in Firebase
    async getSongs() {
      const songsSnapshot = await songsCollection
        .where("uid", "==", auth.currentUser.uid)
        .get();
      songsSnapshot.forEach((document) => {
        const song = {
          ...document.data(),
          id: document.id,
        };
        this.songs.push(song);
      });
    },
    updateSong(index, newSong) {
      this.songs[index].modified_name = newSong.modified_name;
      this.songs[index].genre = newSong.genre;
    },
  },
  created() {
    this.getSongs();
  },
};
</script>
