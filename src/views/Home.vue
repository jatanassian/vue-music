<template>
  <main class="pb-20">
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">
            Share your favorite songs to the World
          </h1>
          <p class="w-full md:w-8/12 mx-auto">
            Upload your music, listen to everybody's songs and comment them.
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="/assets/img/introduction-music.png"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
          v-icon="{ icon: 'headphones-alt', color: 'green' }"
        >
          <span class="card-title">Songs</span>
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <song-item
            v-for="song in songs"
            :key="song.id"
            :song="song"
          ></song-item>
        </ol>
      </div>
    </section>
  </main>
</template>

<script>
import { songsCollection } from "@/includes/firebase";
import SongItem from "@/components/home/SongItem.vue";

export default {
  name: "Home",
  components: { SongItem },
  data() {
    return {
      songs: [],
      songsPerPage: 5,
      loading: false,
    };
  },
  computed: {
    lastSongFromList() {
      return this.songs[this.songs.length - 1];
    },
  },
  methods: {
    async getSongs() {
      if (this.loading) return;

      this.loading = true;

      let songsSnapshots;
      if (this.songs.length) {
        const lastSongDoc = await songsCollection
          .doc(this.lastSongFromList.id)
          .get();

        songsSnapshots = await songsCollection
          .orderBy("modified_name")
          .startAfter(lastSongDoc)
          .limit(this.songsPerPage)
          .get();
      } else {
        songsSnapshots = await songsCollection
          .orderBy("modified_name")
          .limit(this.songsPerPage)
          .get();
      }

      songsSnapshots.forEach((song) => {
        this.songs.push({
          ...song.data(),
          id: song.id,
        });
      });
      this.loading = false;
    },
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;

      const isBottomOfWindow =
        Math.round(scrollTop) + window.innerHeight === offsetHeight;

      if (isBottomOfWindow) this.getSongs();
    },
  },
  created() {
    this.getSongs();

    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>
