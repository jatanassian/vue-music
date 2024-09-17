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
        @click="setSong(song)"
      >
        <i class="fas fa-play"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ song.modified_name }}</div>
        <div>{{ song.genre }}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">Comments ({{ sortedComments.length }})</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <div
          v-if="alert.show"
          class="text-white text-center fond-bold p-4 mb-4"
          :class="alert.variant"
        >
          {{ alert.message }}
        </div>
        <VeeForm v-if="isLoggedIn" @submit="submitComment">
          <VeeField
            as="textarea"
            name="comment"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."
            rules="required|min:3"
          ></VeeField>
          <ErrorMessage class="text-red-600" name="comment" />
          <button
            type="submit"
            class="py-1.5 px-3 rounded text-white bg-green-600 block"
            :disabled="isLoading"
          >
            Submit
          </button>
        </VeeForm>
        <!-- Sort Comments -->
        <select
          :value="$route.query.sort === 'oldest' ? 'oldest' : 'latest'"
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          @change="updateSort"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul id="comments" class="container mx-auto">
    <li
      v-for="comment in sortedComments"
      :key="comment.id"
      class="p-6 bg-gray-50 border border-gray-200"
    >
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">{{ comment.user }}</div>
        <time>{{ comment.created_at }}</time>
      </div>

      <p>{{ comment.text }}</p>
    </li>
  </ul>
</template>

<script>
import { createComment, getCommentsOfSong, getSongById } from '@/utils/firebase';
import { mapState, mapActions } from 'pinia';
import useUserStore from '@/stores/user';
import useSongStore from '@/stores/song';

export default {
  name: 'Song',
  data() {
    return {
      song: {},
      comments: [],
      isLoading: false,
      alert: {
        show: false,
        variant: 'bg-blue-500',
        message: 'Submitting your comment, please wait.'
      }
    };
  },
  computed: {
    ...mapState(useUserStore, ['isLoggedIn']),
    sortedComments() {
      return this.comments.toSorted((a, b) =>
        this.$route.query.sort === 'oldest'
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at)
      );
    }
  },
  async created() {
    const song = await getSongById(this.$route.params.id);
    song ? (this.song = song) : this.$router.push({ name: 'home' });
    this.comments = await getCommentsOfSong(this.$route.params.id);
  },
  methods: {
    ...mapActions(useSongStore, ['setSong']),
    async submitComment({ comment }, { resetForm }) {
      this.isLoading = true;
      this.alert.show = true;
      this.alert.variant = 'bg-blue-500';
      this.alert.message = 'Submitting your comment, please wait.';
      try {
        const newComment = await createComment(this.$route.params.id, comment);
        this.comments.push(newComment);
        this.alert.show = true;
        this.alert.variant = 'bg-green-500';
        this.alert.message = 'Comment posted.';
        resetForm();
      } catch (error) {
        this.alert.show = true;
        this.alert.variant = 'bg-red-500';
        this.alert.message = 'Unable to post your comment, try again later.';
      } finally {
        this.isLoading = false;
      }
    },
    updateSort(event) {
      this.$router.push({
        query: { sort: event.target.value }
      });
    }
  }
};
</script>
