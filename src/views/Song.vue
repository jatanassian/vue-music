<template>
  <main class="pb-11">
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          id="cypress-play-btn"
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
          @click.prevent="playSong"
        >
          <i class="fas" :class="isAudioPlaying ? 'fa-pause' : 'fa-play'"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.display_name }}</div>
        </div>
      </div>
    </section>

    <!-- Comment Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">Comments ({{ song.comments_count }})</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            v-if="alert.show"
            class="text-white text-center font-bold p-4 mb-4"
            :class="alert.color"
          >
            {{ alert.text }}
          </div>
          <vee-form
            v-if="userLoggedIn"
            :validation-schema="schema"
            @submit="addComment"
          >
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></vee-field>
            <ErrorMessage class="text-red-600" name="comment" />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="loading"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            v-model="sortSelection"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="new">Latest</option>
            <option value="old">Oldest</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        v-for="comment in sortedComments"
        :key="comment.id"
        class="p-6 bg-gray-50 border border-gray-200"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.user_name }}</div>
          <time>{{ comment.date }}</time>
        </div>

        <p>
          {{ comment.text }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
// TODO: Change play button to pause if playing, but only if it is this audio currently playing
import { songsCollection, auth, commentsCollection } from "@/includes/firebase";
import { mapState, mapActions } from "pinia";
import useUserStore from "@/stores/user";
import useSongStore from "@/stores/song";

export default {
  name: "Song",
  data() {
    return {
      song: {},
      comments: [],
      sortSelection: "new",
      schema: {
        comment: "required|min:3",
      },
      loading: false,
      alert: {
        show: false,
        color: "bg-blue-500",
        text: "Submitting comment, please wait.",
      },
    };
  },
  computed: {
    ...mapState(useUserStore, ["userLoggedIn"]),
    ...mapState(useSongStore, ["isAudioPlaying", "toggleAudio", "currentSong"]),
    sortedComments() {
      const comments = [...this.comments];
      return comments.sort((a, b) => {
        if (this.sortSelection === "new") {
          return new Date(b.date) - new Date(a.date);
        } else {
          return new Date(a.date) - new Date(b.date);
        }
      });
    },
  },
  methods: {
    ...mapActions(useSongStore, ["newSong"]),
    // Fetch commentsfor a specific song
    async getComments() {
      this.comments = [];

      const commentsSnapshot = await commentsCollection
        .where("song_id", "==", this.$route.params.id)
        .get();

      commentsSnapshot.forEach((comment) => {
        this.comments.push({
          id: comment.id,
          ...comment.data(),
        });
      });
    },
    // Add comment to Firebase and refresh them
    async addComment(values, context) {
      this.loading = true;
      this.alert.show = true;
      this.alert.color = "bg-blue-500";
      this.alert.text = "Submitting comment, please wait.";

      const comment = {
        text: values.comment,
        date: new Date().toString(),
        song_id: this.$route.params.id,
        user_name: auth.currentUser.displayName,
        user_id: auth.currentUser.uid,
      };

      try {
        await commentsCollection.add(comment);
      } catch (error) {
        this.loading = false;
        this.alert.color = "bg-red-500";
        this.alert.text = "Something went wrong, please try again.";
        return;
      }

      this.getComments();

      this.song.comments_count++;
      await songsCollection.doc(this.$route.params.id).update({
        comments_count: this.song.comments_count,
      });

      this.loading = false;
      this.alert.color = "bg-green-500";
      this.alert.text = "Comment added.";

      context.resetForm();
    },
    // Store song info in the state
    playSong() {
      if (this.currentSong.modified_name) this.toggleAudio();
      else this.newSong(this.song);
    },
  },
  async beforeRouteEnter(to, from, next) {
    const songSnapshot = await songsCollection.doc(to.params.id).get();

    next((vm) => {
      if (songSnapshot.exists) vm.song = songSnapshot.data();
      else vm.$router.push({ name: "home" });

      const { sort } = vm.$route.query;
      vm.sortSelection = sort === "new" || sort === "old" ? sort : "new";

      vm.getComments();
    });
  },
  watch: {
    // Update url with the sorting method selected
    sortSelection(value) {
      if (value === this.$route.query.sort) return;

      this.$router.push({
        query: {
          sort: value,
        },
      });
    },
  },
};
</script>
