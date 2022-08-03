<template>
  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div
      class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)"
    ></div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button
        type="button"
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
      >
        <i class="fas fa-play"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ song.modified_name }}</div>
        <div>{{ song.display_name }}</div>
      </div>
    </div>
  </section>

  <!-- Comment Form -->
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title"
          >Comments ({{ song.comments_count || 0 }})</span
        >
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
        <vee-form :validation-schema="schema" @submit="addComment">
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
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        >
          <option value="1">Latest</option>
          <option value="2">Oldest</option>
        </select>
      </div>
    </div>
  </section>

  <!-- Comments -->
  <ul class="container mx-auto">
    <li class="p-6 bg-gray-50 border border-gray-200">
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">Elaine Dreyfuss</div>
        <time>5 mins ago</time>
      </div>

      <p>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium der doloremque laudantium.
      </p>
    </li>
  </ul>
</template>

<script>
import { songsCollection, auth, commentsCollection } from "@/includes/firebase";

export default {
  name: "Song",
  data() {
    return {
      song: {},
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
  methods: {
    async getSong() {
      const songSnapshot = await songsCollection
        .doc(this.$route.params.id)
        .get();
      if (songSnapshot.exists) this.song = songSnapshot.data();
      else this.$router.push({ name: "home" });
    },
    async addComment(values, context) {
      this.loading = true;
      this.alert.show = true;
      this.alert.color = "bg-blue-500";
      this.alert.text = "Submitting comment, please wait.";

      const comment = {
        text: values.comment,
        date: new Date().toString(),
        songId: this.$route.params.id,
        userName: auth.currentUser.displayName,
        userId: auth.currentUser.uid,
      };
      console.log(comment);

      try {
        await commentsCollection.add(comment);
      } catch (error) {
        this.loading = false;
        this.alert.color = "bg-red-500";
        this.alert.text = "Something went wrong, please try again.";
        return;
      }
      this.loading = false;
      this.alert.color = "bg-green-500";
      this.alert.text = "Comment added.";

      context.resetForm();
    },
  },
  created() {
    this.getSong();
  },
};
</script>
