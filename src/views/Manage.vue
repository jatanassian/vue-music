<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <upload :add-song="addSong"></upload>
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
              :update-unsaved-edit="updateUnsavedEdit"
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
      unsavedEdit: false,
    };
  },
  methods: {
    // Fetch user's songs in Firebase
    async getSongs() {
      const songsSnapshot = await songsCollection
        .where("user_id", "==", auth.currentUser.uid)
        .get();
      songsSnapshot.forEach(this.addSong);
    },
    // Add song to the songs list
    addSong(document) {
      const song = {
        ...document.data(),
        id: document.id,
      };
      this.songs.push(song);
    },
    // Edit or delete a song in the list
    updateSong(index, song) {
      if (song) {
        this.songs[index].genre = song.genre;
        this.songs[index].modified_name = song.modified_name;
      } else {
        this.songs.splice(index, 1);
      }
    },
    updateUnsavedEdit(value) {
      this.unsavedEdit = value;
    },
  },
  created() {
    this.getSongs();
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedEdit) {
      next();
    } else {
      // TODO: Confirm not showing up if I edit song A (not saved) and then edit and save song B => unsavedEdit gets overwritten => make it an object for every song and if one of the object's prop has true value then show confirm?
      const leaveConfirmed = confirm(
        "You have unsaved changes. Are you sure you want to leave the page?"
      );
      next(leaveConfirmed);
    }
  },
};
</script>
